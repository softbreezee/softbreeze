document.addEventListener('DOMContentLoaded', function() {
    // 高亮当前路由
    const navItems = document.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;
  
    navItems.forEach(item => {
      if (item.getAttribute('href') === currentPath) {
        item.classList.add('active');
      }
    });
  
    // 移动端触摸滑动
    const scroller = document.querySelector('.nav-scroller');
    let isDown = false;
    let startX;
    let scrollLeft;
  
    scroller.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
    });
  
    scroller.addEventListener('mouseleave', () => {
      isDown = false;
    });
  
    scroller.addEventListener('mouseup', () => {
      isDown = false;
    });
  
    scroller.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scroller.offsetLeft;
      const walk = (x - startX) * 2;
      scroller.scrollLeft = scrollLeft - walk;
    });
  });