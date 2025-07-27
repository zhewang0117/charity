import { defineStore } from 'pinia';
import activities from '@/assets/volunteer-activities.json';
import bcrypt from 'bcryptjs';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    users: JSON.parse(localStorage.getItem('users')) || [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('admin123', 10), // Passwords should be hashed
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ],
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
    hashPassword(password) {
      return bcrypt.hashSync(password, 10);
    },
    login(email, password) {
      const user = this.users.find(u => u.email === email);
      if (user && bcrypt.compareSync(password, user.password)) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }
      return false;
    },
    sanitizeInput(input) {
      const temp = document.createElement('div');
      temp.textContent = input;
      return temp.innerHTML;
    },
    register(userData) {
      // Check if email already exists
      if (this.users.some(u => u.email === userData.email)) {
        return { success: false, message: 'Email already exists' }
      }
      
      const newUser = {
        name: this.sanitizeInput(userData.name),
        email: this.sanitizeInput(userData.email),
        password: this.hashPassword(userData.password),
        id: Date.now().toString(),
        role: userData.role || 'immigrant',
        createdAt: new Date().toISOString()
      };
      
      this.users.push(newUser)
      this.user = newUser
      localStorage.setItem('users', JSON.stringify(this.users))
      localStorage.setItem('user', JSON.stringify(newUser))
      return { success: true }
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },
    getPendingRatings() {
      if (!this.user) return [];
      return this.serviceRecords.filter(record => record.userId === this.user.id && record.status === 'pending');
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

    updateUserProfile(userData) {
      const index = this.users.findIndex(u => u.id === this.user.id)
      if (index !== -1) {
        const sanitizedData = {};
        if (userData.name) sanitizedData.name = this.sanitizeInput(userData.name);
        if (userData.email) sanitizedData.email = this.sanitizeInput(userData.email);
        // Add other fields as needed, ensuring they are sanitized if they are strings

        this.users[index] = { ...this.users[index], ...userData, ...sanitizedData };
        this.user = this.users[index];
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    }
  }
})

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
        const userId = useAuthStore().user.id
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
})

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
})