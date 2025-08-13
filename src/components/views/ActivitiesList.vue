<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Volunteer Activities</h1>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :search-options="{ enabled: true, placeholder: 'Search activities...' }"
      :pagination-options="{ enabled: true, mode: 'records', perPage: 10 }"
      :sort-options="{ enabled: true, initialSortBy: { field: 'date', type: 'desc' } }"
      styleClass="vgt-table striped bordered"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import { VueGoodTable } from 'vue-good-table-next';
import activitiesData from '@/assets/volunteer-activities.json';

const columns = ref([
  {
    label: 'Title',
    field: 'title',
    filterOptions: { enabled: true, placeholder: 'Filter by Title' },
  },
  {
    label: 'Location',
    field: 'location',
    filterOptions: { enabled: true, placeholder: 'Filter by Location' },
  },
  {
    label: 'Date',
    field: 'date',
    type: 'date',
    dateInputFormat: 'yyyy-MM-dd',
    dateOutputFormat: 'MMM do yy',
  },
  {
    label: 'Description',
    field: 'description',
    sortable: false,
  },
]);

const rows = ref(activitiesData.activities);
</script>

<style scoped>
.container {
  padding: 2rem;
}
h1 {
  color: #333;
}
</style>