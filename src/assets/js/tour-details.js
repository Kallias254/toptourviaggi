document.addEventListener('DOMContentLoaded', function() {

    const tabs = document.querySelectorAll('.nav-tabs .nav-link');
    const tabPanes = document.querySelectorAll('.tab-content .tab-pane');

    function activateTab(selectedTab) {
        // Deactivate all tabs and tab contents
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
        });

        // Activate the selected tab and its content
        selectedTab.classList.add('active');
        const targetPaneId = selectedTab.getAttribute('data-bs-target');
        const targetPane = document.querySelector(targetPaneId);
        if (targetPane) {
            targetPane.classList.add('active');
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            activateTab(tab);
            event.preventDefault(); // Prevent the default anchor behavior
        });
    });

    // Optionally activate the first tab on load
    if (tabs.length > 0) {
        activateTab(tabs[0]);
    }

    //js fro the submit booking form button
        const bookingForm = document.querySelector('.sidebar-booking-form');
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();  // Prevent the form from submitting traditionally
    
            // Extract data from the form
            const formData = new FormData(bookingForm);
            const tourURL = bookingForm.dataset.tourUrl;  // Get the tour URL from data attribute
            const count0 = parseInt(formData.get('count0'), 10);
            const count1 = parseInt(formData.get('count1'), 10);
            const count2 = parseInt(formData.get('count2'), 10);
            const totalGuests = count0 + count1 + count2;
            const country = formData.get('country').toLowerCase();
    
            let adultPrice = parseFloat(bookingForm.dataset.adultPrice);
            let youthPrice = parseFloat(bookingForm.dataset.youthPrice);
            let childPrice = parseFloat(bookingForm.dataset.childPrice);
    
            // Adjust prices based on the user's country
            if (country === 'kenya') {
                adultPrice = parseFloat(bookingForm.dataset.residentAdultPrice);
                youthPrice = parseFloat(bookingForm.dataset.residentYouthPrice);
                childPrice = parseFloat(bookingForm.dataset.residentChildPrice);
            }
    
            // Calculate total price based on quantities selected
            const totalPrice = (adultPrice * count0) + (youthPrice * count1) + (childPrice * count2);
    
            const bookingDetails = {
                date: formData.get('date'),
                tourURL: tourURL,
                totalGuests,
                totalPrice,
                count0: count0,
                count1: count1,
                count2: count2,
                country,
                tourTitle: bookingForm.dataset.title,
                image: bookingForm.dataset.image,
                alt: bookingForm.dataset.alt,
                // image: window.cardImageSrc, 
                adultPrice,
                youthPrice,
                childPrice,
                duration: bookingForm.dataset.duration,
                location: bookingForm.dataset.location
            };
    
            // Store the data in localStorage
            localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    
            // Redirect to the checkout page
            window.location.href = '/checkout';
        });

});