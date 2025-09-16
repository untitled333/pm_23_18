

document.getElementById('greetBtn')?.addEventListener('click', function(){
    const now = new Date();
    const hours = now.getHours();
    const greeting = hours < 12 ? '' : (hours < 18 ? 'Good day' : 'Good evening');
    const el = document.getElementById('greetText');
    if(el) el.textContent = `${greeting}! Now: ${now.toLocaleTimeString()}.`;
});
