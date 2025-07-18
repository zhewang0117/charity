<template>
  <div class="container mt-5">
    <h2>Edit Profile</h2>
    <div v-if="user">
      <form @submit.prevent="updateProfile">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control" id="name" v-model="editableUser.name">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" v-model="editableUser.email" readonly>
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input type="text" class="form-control" id="address" v-model="editableUser.address">
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <input type="text" class="form-control" id="phone" v-model="editableUser.phone">
        </div>
        <div class="mb-3">
          <label for="bio" class="form-label">Bio</label>
          <textarea class="form-control" id="bio" rows="3" v-model="editableUser.bio"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </form>
    </div>
    <div v-else>
      <p>Loading user data...</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'EditProfile',
  data() {
    return {
      editableUser: {}
    };
  },
  computed: {
    ...mapState(useAuthStore, ['user'])
  },
  methods: {
    ...mapActions(useAuthStore, ['updateUserProfile']),
    updateProfile() {
      this.updateUserProfile(this.editableUser);
      alert('Profile updated successfully!');
      this.$router.push('/profile');
    }
  },
  watch: {
    user: {
      handler(newUser) {
        if (newUser) {
          this.editableUser = { ...newUser };
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>