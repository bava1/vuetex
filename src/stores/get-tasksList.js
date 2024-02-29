import { defineStore } from "pinia";
import axios from "axios";
import { tasksList } from "./tasksList";

export const useGetListStore = defineStore("globalStore", {

  state: () => ({
    tasks: tasksList.reverse(),
    counter: 0,

  }),

  // getters
  getters: {
    getTasks: (state) => state.tasks,
    minusCount: (state) => (znak) => state.counter / znak,
  },

  // actions
  actions: {
    async addTask(desk) {
      let taskId = `task ${this.tasks.length + 1}`;
      await this.tasks.unshift({
        name: taskId,
        description: desk,
      });
    },

    updateTask(index, desc) {
      this.tasks[index].description = desc
    },

    deleteTask(index) {
      this.tasks.splice(index, 1);
    },

    async increment(num) {
      this.counter += num;
    },

    decrement(num) {
      this.counter -= num;
    },
  },
});


