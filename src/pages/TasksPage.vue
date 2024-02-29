<template>
  <div class="tasks">
    <div class="tasks-block">
      <div class="tasks-block_title text-h5 q-pb-md">Tasks</div>
      <div class="tasks-block_form">
        <q-input
          class="tasks-block_form-input text-white q-mb-md"
          input-class="text-white"
          outlined
          v-model="taskText"
          label="Task text"
          label-color="green-12">
          <template v-if="taskText.length > 0" v-slot:append>
            <q-icon name="close" color="green-12" @click="taskText = ''" class="cursor-pointer" />
          </template>
        </q-input>
        <div>
          <q-btn
            v-if="!buttonUpdateTask"
            @click="taskSend"
            outline
            class="q-py-md"
            color="green-12"
            label="Add task" />
          <q-btn
            v-if="buttonUpdateTask"
            @click="updateTask"
            outline
            class="q-py-md"
            color="green-12"
            label="Save task" />
        </div>
      </div>

      <q-scroll-area class="tasks-block_area">
        <div
          v-for="(task, index) in tasksList" :key="index"
          class="tasks-block_area-task row justify-between q-pa-md q-mb-md">
          <div class="tasks-block_area-task_text">
            <q-icon
              class="q-mr-md" name="content_paste" color="green-9" size="xs" />
            <div>{{ task.description }}</div>
          </div>
          <div>
            <q-icon
              @click="getTask(index, task.description)"
              name="create"
              color="green-7"
              class="q-pl-md cursor-pointer text-weight-bolder" />
            <q-icon
              @click="store.deleteTask(index)"
              name="close"
              color="green-7"
              class="q-pl-md cursor-pointer text-weight-bolder" />
          </div>
        </div>
        <div v-if="tasksList.length === 0" class="tasks-block_title">You have no tasks!</div>
      </q-scroll-area>
      <div class="q-pt-md q-mt-xs text-center">you have only {{ tasksList.length }} tasks </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useGetListStore } from 'src/stores/get-tasksList';
import { storeToRefs } from 'pinia';

const taskText = ref('');
const taskIndex = ref();
const buttonUpdateTask = ref(false);
const tasksList = ref([]);
const store = useGetListStore();
const { getTasks } = storeToRefs(store);
tasksList.value = getTasks.value;

const taskSend = () => {
  if(taskText.value) {
    store.addTask(taskText.value);
    taskText.value = '';
  }
}

const getTask = (index, text) => {
  taskIndex.value = index;
  taskText.value = text;
  buttonUpdateTask.value = true;
}

const updateTask = () => {
  if(taskText.value) {
    store.updateTask(taskIndex.value, taskText.value);
    taskText.value = '';
    buttonUpdateTask.value = false;
  }
}
</script>

<style lang="scss" scoped>
.tasks {
  position: fixed;
  width: 100%;
  height: 1100px;
  margin-top: -85px;
  background-image: url("../assets/img/Tasks-21.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  &-block {
    width: 650px;
    height: 520px;
    margin: 150px auto 0;
    color: #2add7e;

    &_title {
      padding-top: 20px;
      color: #2add7e;
      font-weight: 800;
      letter-spacing: .2rem;
      text-shadow: 2px 2px 2px rgb(66, 193, 178);
      text-align: center;
    }

    &_form {
      display: flex;
      justify-content: space-between;
      width: 654px;
      &-input {
        width: 540px;
        border:1px dashed #0a3b21;
        border-radius: 6px;
      }

      & div {
        opacity: .6;
      }
    }

    &_area {
      height: 350px;
      min-width: 655px;
      &-task {
        border:1px dashed #0a3b21;
        border-radius: 6px;
        &_text {
          display: flex;
          width: 90%;
        }
      }
    }
  }

}

/* RESPONSIVE */
@media screen and (max-width: 1024px) {
  .tasks {
    margin-top: -75px;
    background-image: url("../assets/img/Tasks-24.png");
  }

}
@media screen and (max-width: 768px) {
  .tasks-block_form {
    width: 400px;
  }
  .tasks-block_form-input {
    width: 350px;
  }
  .tasks-block_area {
    width: 405px;
  }

  .tasks-block_area-task {
    width: 400px;
  }
  .tasks-block {
    width: 410px;
  }
  .q-btn {
    font-size: 10px !important;
    padding: 10px 4px !important;
  }
  .tasks-block_area-task_text {
    width: 80%;
  }
}

@media screen and (max-width: 570px) {
  .tasks-block_form {
    width: 300px;
  }
  .tasks-block_form-input {
    width: 250px;
  }
  .tasks-block_area {
    width: 305px;
    height: 250px;
  }

  .tasks-block_area-task {
    width: 300px;
  }
  .tasks-block {
    width: 310px;
    font-size: 10px;
  }
  .q-btn {
    font-size: 10px !important;
    padding: 10px 4px !important;
  }
}
</style>
