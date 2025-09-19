import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";



gsap.registerPlugin(ScrollTrigger);
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('gsap', gsap);
});
