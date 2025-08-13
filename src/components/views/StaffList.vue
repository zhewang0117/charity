<template>
  <div class="container my-5">
    <h2 class="text-center mb-4">Our Staff</h2>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :search-options="{
        enabled: true,
        placeholder: 'Search this table'
      }"
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: 10,
        nextLabel: 'next',
        prevLabel: 'prev',
      }"
      :sort-options="{
        enabled: true,
      }"
      theme="vgt-table bordered striped"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';
import staffData from '../../assets/staff-config.json';

const columns = ref([
  {
    label: 'Name',
    field: 'name',
    filterOptions: { enabled: true, placeholder: 'Filter by Name' },
  },
  {
    label: 'Role',
    field: 'role',
    filterOptions: { enabled: true, placeholder: 'Filter by Role' },
  },
]);

const rows = ref(staffData.volunteers);

</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>