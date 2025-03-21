
//   alert('Hello, Astro1!');
document.querySelector('.hamburger')?.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.toggle('expanded');
//   alert('Hello, Astro2!');
});