const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const slugify = require('slugify');

module.exports = function(eleventyConfig) {

    // Copy `assets` folder to the output (public) directory
    eleventyConfig.addPassthroughCopy("src/assets");

    // Copy `admin` folder to the output (public) directory
    eleventyConfig.addPassthroughCopy("src/admin");

    // Copies the entire 'src/data' directory to '_site/data'
    eleventyConfig.addPassthroughCopy("src/_data");

    // Use the Eleventy Navigation plugin
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // Add a filter to slugify text
    eleventyConfig.addFilter("slug", function(value) {
        return slugify(value, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
    });

    // Blog Posts Collection
    eleventyConfig.addCollection("posts", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
            return b.date - a.date; // Sort by date descending
        });
    });

    // First snippet (for creating category pages)
    eleventyConfig.addCollection("categoryPages", collection => {
    return collection.getAll().reduce((categories, item) => {
        const category = item.data.category;
        if (category) {
        const categorySlug = slugify(category);
        const categoryUrl = `/blog/category/${categorySlug}/`;

        categories[categorySlug] = categories[categorySlug] || [];
        categories[categorySlug].push(item);

        item.data.category = category;
        item.data.permalink = categoryUrl;
        }
        return categories;
    }, {});
    });

    // Second snippet (for getting unique category names)
    eleventyConfig.addCollection("categoryNames", function(collectionApi) {
        const categories = new Set();
        collectionApi.getAll().forEach(item => {
            if (item.data.category) {
            categories.add(item.data.category);
            }
        });
        return Array.from(categories);
    });

    // Add a collection for destinations
    eleventyConfig.addCollection("destinations", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/destinations/*.md");
    });

    // Add a collection for tours
    eleventyConfig.addCollection("tours", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/tours/*.md");
    });
    
    // Add a collection for excursions
    eleventyConfig.addCollection("excursions", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/excursions/*.md");
    });

    // Add the urlQueryParams filter
    eleventyConfig.addFilter('urlQueryParams', function(urlString) {
        const urlObject = new URL(urlString, 'http://example.com');
        return url.parse(urlObject, true).query;
    });

eleventyConfig.addCollection("toursByLocation", function(collectionApi) {
    let groupedTours = {};
    collectionApi.getAll().forEach(function(item) {
        // Check if the item is a tour by checking for a specific tour-only attribute
        if (item.data.location && item.data.tourType) { // Assuming 'tourType' is only present in tours
            let locationNormalized = item.data.location.trim().toLowerCase();
            if (!groupedTours[locationNormalized]) {
                groupedTours[locationNormalized] = [];
            }
            groupedTours[locationNormalized].push(item);
        }
    });
    return groupedTours;
});

eleventyConfig.addCollection("uniqueTourTypes", function(collectionApi) {
    let tourTypes = new Set();
    collectionApi.getAll().forEach(item => {
        if (item.data.tourType) { // Ensure there's a tourType field
            tourTypes.add(item.data.tourType);
        }
    });
    return [...tourTypes]; // Convert Set to Array for easy use
});



    // Title Case Filter
    eleventyConfig.addFilter("titleCase", function(str) {
        if (str) {
            return str.toLowerCase().split(' ').map(function(word) {
                return (word.charAt(0).toUpperCase() + word.slice(1));
            }).join(' ');
        }
        return '';
    });

    //shuffle randonly the ativities in the landing page
    eleventyConfig.addFilter("randomSlice", (array, count) => {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    });
    
    // Inside your module.exports function in .eleventy.js
    eleventyConfig.addCollection("featuredTours", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/tours/*.md").filter(tour => tour.data.featured);
    });

    // Add the url_encode filter
    eleventyConfig.addFilter('url_encode', function(str) {
        return encodeURIComponent(str);
    });

    // Date filter
    eleventyConfig.addFilter("date", function(value) {
        return new Date(value).toLocaleDateString(undefined, {
            month: 'long',   // Full month name (e.g., "November")
            day: 'numeric',  // Numeric day (e.g., "15")
            year: 'numeric'  // Numeric year (e.g., "2022")
        }).toUpperCase(); // Convert the output to uppercase
    });

        // Add a filter to find items by type
    eleventyConfig.addFilter("filterByType", function(items, type) {
        return items.filter(item => item.data.tourType.toLowerCase() === type.toLowerCase());
    });

    // Add a combined collection for tours and excursions
    // eleventyConfig.addCollection("combinedToursExcursions", function(collectionApi) {
    //     // Combine both collections
    //     let tours = collectionApi.getFilteredByGlob("src/tours/*.md");
    //     let excursions = collectionApi.getFilteredByGlob("src/excursions/*.md");
    //     return [...tours, ...excursions];
    // });

    return {
        passthroughFileCopy: true,
        markdownTemplateEngine: "njk",
        templateFormats: ["md", "njk", "html"],
        dir: {
            input: "src",
            output: "public",
            includes: "_includes",
            data: "_data"
        }
    };
};
