<template>
  <div class="panel-stack">
    <section class="form-card pilot-credentials-card">
      <div class="card-heading">
        <h2>Pilot Flight Hours</h2>
        <p>Add and maintain your recent aircraft hours using the same profile workflow as the rest of this section.</p>
      </div>

      <div class="pilot-table" role="table" aria-label="Pilot flight hours">
        <div class="pilot-table-head" role="rowgroup">
          <div class="pilot-head-cell" role="columnheader">Aircraft type</div>
          <div class="pilot-head-cell" role="columnheader">Date Last Flown</div>
          <div class="pilot-head-cell" role="columnheader">Total Fixed-Wing Turbine Time (In Hrs)</div>
          <div class="pilot-head-cell" role="columnheader">Fixed-Wing Turbine Time in last 60 Months (In Hrs)</div>
          <div class="pilot-head-cell" role="columnheader">Total Fixed-Wing PIC Turbine Time (In Hrs)</div>
          <div class="pilot-head-cell" role="columnheader">Total Fixed-Wing SIC Turbine Time (In Hrs)</div>
          <div class="pilot-head-cell pilot-head-cell-actions" role="columnheader">Actions</div>
        </div>

        <div v-for="(row, index) in pilotCredentialsDraft" :key="row.id" class="pilot-table-row" role="row">
          <div class="pilot-cell" role="cell">
            <Dropdown v-model="row.aircraftType" :options="aircraftOptions" optionLabel="label" optionValue="value" placeholder="Type" class="pilot-field" />
          </div>
          <div class="pilot-cell" role="cell">
            <Calendar v-model="row.dateLastFlown" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" showIcon iconDisplay="input" class="pilot-field" />
          </div>
          <div class="pilot-cell" role="cell">
            <InputText v-model="row.totalFixedWingTurbineTime" class="pilot-field" />
          </div>
          <div class="pilot-cell" role="cell">
            <InputText v-model="row.fixedWingTurbineLast60Months" class="pilot-field" />
          </div>
          <div class="pilot-cell" role="cell">
            <InputText v-model="row.totalPicTurbineTime" class="pilot-field" />
          </div>
          <div class="pilot-cell" role="cell">
            <InputText v-model="row.totalSicTurbineTime" class="pilot-field" />
          </div>
          <div class="pilot-cell pilot-cell-actions" role="cell">
            <Button
              icon="pi pi-trash"
              text
              rounded
              severity="secondary"
              class="pilot-delete-btn"
              :aria-label="`Remove aircraft row ${index + 1}`"
              :disabled="pilotCredentialsDraft.length === 1"
              @click="onRemove(index)"
            />
          </div>
        </div>

        <button type="button" class="pilot-add-row" @click="onAdd">
          <i class="pi pi-plus"></i>
          <span>Add Aircraft</span>
        </button>
      </div>

      <div class="actions-row pilot-actions-row">
        <Button label="Discard Changes" severity="secondary" outlined @click="onReset" />
        <Button label="Submit" severity="primary" class="pilot-submit-btn" @click="onSave" />
      </div>
    </section>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';

defineProps({
  pilotCredentialsDraft: Array,
  aircraftOptions: Array,
  onAdd: Function,
  onRemove: Function,
  onReset: Function,
  onSave: Function
});
</script>
