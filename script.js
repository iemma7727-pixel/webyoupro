// simple interactivity: mobile nav toggle + carousel controls
document.addEventListener('DOMContentLoaded', function(){
  // nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  navToggle && navToggle.addEventListener('click', () => {
    if(nav.style.display === 'flex') nav.style.display = 'none';
    else nav.style.display = 'flex';
  });

  // simple horizontal carousel
  const track = document.querySelector('.carousel-track');
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');

  if(track){
    const cardWidth = () => track.querySelector('.card').getBoundingClientRect().width + 16;
    prev && prev.addEventListener('click', () => {
      track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });
    next && next.addEventListener('click', () => {
      track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    });
  }

  // reveal on scroll (simple)
  const reveals = document.querySelectorAll('.section, .card, .service-card');
  const onScroll = () => {
    const top = window.innerHeight;
    reveals.forEach(el => {
      const r = el.getBoundingClientRect();
      if(r.top < top - 60) el.style.opacity = 1, el.style.transform = 'translateY(0)';
      else { el.style.opacity = 0; el.style.transform = 'translateY(10px)'; }
    });
  };
  reveals.forEach(el => { el.style.transition = 'all 600ms cubic-bezier(.2,.8,.2,1)'; el.style.opacity = 0; el.style.transform = 'translateY(10px)'; });
  window.addEventListener('scroll', onScroll);
  onScroll();
});
