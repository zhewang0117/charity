import { defineStore } from 'pinia';
import { auth, db } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import activities from '@/assets/volunteer-activities.json';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthResolved: false, // 新增状态，用于跟踪认证是否完成
    volunteers: JSON.parse(localStorage.getItem('volunteers')) || [
      { id: 'v1', name: 'John Doe', ratings: [] },
      { id: 'v2', name: 'Jane Smith', ratings: [] }
    ],
    serviceRecords: JSON.parse(localStorage.getItem('serviceRecords') || '[]'),
    volunteerActivities: activities
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user
  },
  actions: {
    async register(userData) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const user = userCredential.user;
        
        const userProfile = {
          name: userData.name,
          email: userData.email,
          role: userData.role || 'immigrant',
          languagePreference: userData.languagePreference || 'en',
          createdAt: new Date().toISOString()
        };

        // 增加空值校验
const sanitizedProfile = Object.fromEntries(
  Object.entries(userProfile).map(([key, val]) => [key, val || 'N/A'])
);
await setDoc(doc(db, 'users', user.uid), sanitizedProfile);

        this.user = { uid: user.uid, ...userProfile };
        this.isAuthResolved = true; // 设置认证完成标志
        localStorage.setItem('user', JSON.stringify(this.user));
        
        return { success: true, user: this.user };
      } catch (error) {
        console.error('Registration Error:', error);
    return { success: false, message: error.message, code: error.code };
      }
    },

    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        let userDoc;
        try {
          userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            this.user = {
              uid: user.uid,
              email: user.email,
              name: userDoc.data().name || 'New User',
              role: userDoc.data().role || 'immigrant',
              languagePreference: userDoc.data().languagePreference || 'en'
            };
          } else {
            // Firestore doc missing, fallback to minimal auth-derived profile
            this.user = {
              uid: user.uid,
              email: user.email,
              name: 'New User',
              role: 'immigrant',
              languagePreference: 'en'
            };
          }
        } catch (err) {
          // If Firestore is unreachable (emulator not running or offline),
          // try to preserve any previously stored role in localStorage so a
          // user who registered as 'volunteer' doesn't get shown as 'immigrant'.
          console.warn('getDoc failed during login, falling back to auth user:', err);
          let fallbackRole = 'immigrant';
          try {
            const stored = localStorage.getItem('user');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.role) fallbackRole = parsed.role;
            }
          } catch (e) {
            // ignore parse errors and keep default
          }
          this.user = {
            uid: user.uid,
            email: user.email,
            name: 'New User',
            role: fallbackRole,
            languagePreference: 'en'
          };
        }

        this.isAuthResolved = true;
        localStorage.setItem('user', JSON.stringify(this.user));
        return { success: true, user: this.user };
      } catch (error) {
        console.error('Login Error:', error);
        return { success: false, message: error.message };
      }
    },

    async logout() {
      await signOut(auth);
      this.user = null;
      localStorage.removeItem('user');
    },
    
    fetchUser() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (!this.user || this.user.uid !== user.uid) {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        this.user = { uid: user.uid, ...userDoc.data() };
        this.isAuthResolved = true;
                    } else {
                        this.user = { uid: user.uid, email: user.email };
                    }
                    localStorage.setItem('user', JSON.stringify(this.user));
                }
            } else {
                this.user = null;
                localStorage.removeItem('user');
            }
        });
    },

    getPendingRatings() {
      if (!this.user) return [];
      return this.serviceRecords.filter(record => record.userId === this.user.uid && record.status === 'pending');
    },

    getVolunteerById(id) {
      return this.volunteers.find(v => v.id === id);
    },

    getVolunteerAverageRating(volunteerId) {
      const volunteer = this.volunteers.find(v => v.id === volunteerId);
      if (!volunteer || volunteer.ratings.length === 0) return 'No ratings yet';
      const total = volunteer.ratings.reduce((sum, rating) => sum + rating.score, 0);
      return (total / volunteer.ratings.length).toFixed(1);
    },

    submitRating(serviceId, ratings) {
      const record = this.serviceRecords.find(r => r.id === serviceId);
      if (!record) return;
      const volunteer = this.volunteers.find(v => v.id === record.volunteerId);
      if (!volunteer) return;
      const scores = Object.values(ratings);
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      volunteer.ratings.push({ serviceId, score: averageScore, details: ratings });
      record.status = 'completed';
      this.saveVolunteersToLocalStorage();
      this.saveServiceRecordsToLocalStorage();
    },

    saveVolunteersToLocalStorage() {
      localStorage.setItem('volunteers', JSON.stringify(this.volunteers));
    },

    saveServiceRecordsToLocalStorage() {
      localStorage.setItem('serviceRecords', JSON.stringify(this.serviceRecords));
    },

    completeService(userId, volunteerId, activityId) {
      const activity = this.volunteerActivities.find(a => a.id === activityId);
      if (activity) {
        const serviceRecord = {
          id: `s${Date.now()}`,
          userId: userId,
          volunteerId: volunteerId,
          activityTitle: activity.name,
          status: 'pending',
          date: new Date().toISOString().split('T')[0]
        };
        this.serviceRecords.push(serviceRecord);
        this.saveServiceRecordsToLocalStorage();
      }
    },

    async updateUserProfile(userData) {
        if (!this.user) return;
        try {
            const userRef = doc(db, 'users', this.user.uid);
            const sanitizedData = {};
            if (userData.name) sanitizedData.name = this.sanitizeInput(userData.name);
            if (userData.email) sanitizedData.email = this.sanitizeInput(userData.email);
            
            await setDoc(userRef, { ...userData, ...sanitizedData }, { merge: true });
            const updatedDoc = await getDoc(userRef);
            this.user = { uid: this.user.uid, ...updatedDoc.data() };
            localStorage.setItem('user', JSON.stringify(this.user));
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    },
    sanitizeInput(input) {
      const temp = document.createElement('div');
      temp.textContent = input;
      return temp.innerHTML;
    },
  }
});

export const useResourceStore = defineStore('resources', {
  state: () => ({
    resources: JSON.parse(localStorage.getItem('resources')) || [
      {
        id: '1',
        title: 'Healthcare for Immigrants',
        description: 'Information about healthcare services available for immigrants',
        category: 'healthcare',
        ratings: [
          { userId: '1', rating: 4, createdAt: '2023-01-15' },
          { userId: '2', rating: 5, createdAt: '2023-01-20' }
        ],
        createdAt: '2023-01-01'
      }
    ]
  }),
  actions: {
    addResource(resource) {
      const newResource = {
        ...resource,
        id: Date.now().toString(),
        ratings: [],
        createdAt: new Date().toISOString()
      }
      this.resources.push(newResource)
      this.saveToLocalStorage()
    },
    addRating(resourceId, rating) {
      const resource = this.resources.find(r => r.id === resourceId)
      if (resource) {
        const userId = useAuthStore().user.uid
        const existingRatingIndex = resource.ratings.findIndex(r => r.userId === userId)
        
        if (existingRatingIndex !== -1) {
          resource.ratings[existingRatingIndex].rating = rating
        } else {
          resource.ratings.push({
            userId,
            rating,
            createdAt: new Date().toISOString()
          })
        }
        this.saveToLocalStorage()
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('resources', JSON.stringify(this.resources))
    }
  },
  getters: {
    getAverageRating: (state) => (resourceId) => {
      const resource = state.resources.find(r => r.id === resourceId)
      if (!resource || resource.ratings.length === 0) return 0
      const sum = resource.ratings.reduce((total, r) => total + r.rating, 0)
      return sum / resource.ratings.length
    },
    getUserRating: (state) => (resourceId, userId) => {
      const resource = state.resources.find(r => r.id === resourceId)
      if (!resource) return 0
      const rating = resource.ratings.find(r => r.userId === userId)
      return rating ? rating.rating : 0
    }
  }
});

export const useCommunityStore = defineStore('community', {
  state: () => ({
    posts: JSON.parse(localStorage.getItem('communityPosts')) || []
  }),
  actions: {
    addPost(post) {
      const newPost = {
        ...post,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        comments: []
      }
      this.posts.unshift(newPost)
      this.saveToLocalStorage()
    },
    addComment(postId, comment) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        post.comments.push({
          ...comment,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        })
        this.saveToLocalStorage()
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('communityPosts', JSON.stringify(this.posts))
    }
  }
});