module.exports = {
    homeSearchComponent: `<% listings.forEach((listing, index) => { %>
        <div class="row item col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
            <div class="mdc-card property-item grid-item column-4 full-width-page">
                <div class="thumbnail-section">
                    <div class="row property-status">
                        <% for(let i = 0; i < listing.listingInfo.tags.length; i++) { %>
                        <% let tag = listing.listingInfo.tags[i]; %>
                        <% let color = tag === "FOR SALE" ? "green" :
                                               tag === "FEATURED" ? "orange" :
                                               tag === "FOR RENT" ? "blue" :
                                               tag === "HOT OFFER" ? "red" :
                                               tag === "SOLD" ? "dark" :
                                               tag === "NEW" ? "teal" : ""
                                %>
                        <span class="<%= color %>"><%= tag %></span>
                        <% } %>
                    </div>
                    <div class="property-image">
                        <div class="swiper-container">
                            <div class="swiper-wrapper">
                            <% listing.media.images.forEach((image) =>{ %>
                                <div class="swiper-slide">
                                    <img src="/assets/images/others/transparent-bg.png"
                                        alt="slide image <%= image %>"
                                        data-src="/uploads/listing/<%= listing._id %>/images/medium/<%= image %>"
                                        class="slide-item swiper-lazy">
                                    <div class="swiper-lazy-preloader"></div>
                                </div>
                                <% }); %>
                            </div>
                            <div class="swiper-pagination white"></div>
                            <button class="mdc-icon-button swiper-button-prev swipe-arrow"><i
                                    class="material-icons mat-icon-lg">keyboard_arrow_left</i></button>
                            <button class="mdc-icon-button swiper-button-next swipe-arrow"><i
                                    class="material-icons mat-icon-lg">keyboard_arrow_right</i></button>
                        </div>
                    </div>
                    <div class="control-icons">
                        <button class="mdc-button add-to-favorite" data-value="<%= listing._id %>" title="Add To Favorite">
                            <i class="material-icons mat-icon-sm">favorite_border</i>
                        </button>
                        <button class="mdc-button add-to-compare" data-value="<%= listing._id %>" title="Add To Compare">
                            <i class="material-icons mat-icon-sm">compare_arrows</i>
                        </button>
                    </div>
                </div>
                <div class="property-content-wrapper">
                    <div class="property-content">
                        <div class="content">
                            <h1 class="title">
                                <a href="/listing/<%= hyphenateString(listing.listingInfo.title) + "-"+ listing._id %>">
                                <%= listing.listingInfo.title %>
                                </a>
                            </h1>
                            <p class="row address flex-nowrap">
                                <i class="material-icons text-muted">location_on</i>
                                <span><%= listing.location.sector + ", " + listing.location.city %></span>
                            </p>
                            <div class="row between-xs middle-xs">
                                <h3 class="primary-color price">
                                    <span><%= new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0,  maximumFractionDigits: 0 }).format(listing.price) %></span>
                                </h3>
                                <div class="row start-xs middle-xs ratings" title="29">
                                    <i class="material-icons mat-icon-sm">star</i>
                                    <i class="material-icons mat-icon-sm">star</i>
                                    <i class="material-icons mat-icon-sm">star</i>
                                    <i class="material-icons mat-icon-sm">star</i>
                                    <i class="material-icons mat-icon-sm">star_half</i>
                                </div>
                            </div>
                            <div class="d-none d-md-flex d-lg-flex d-xl-flex">
                                <div class="description mt-3">
                                    <p><%= listing.description %></p>
                                </div>
                            </div>
                            <div class="features mt-3">
                                <p><span>Property size</span><span><%= listing.propertyInfo.area %> ft²</span></p>
                                <p><span>Bedrooms</span><span><%= listing.propertyInfo.bedrooms %></span></p>
                                <p><span>Bathrooms</span><span><%= listing.propertyInfo.bathrooms %></span></p>
                                <p><span>Garages</span><span><%= listing.propertyInfo.reservedParking %></span></p>
                            </div>
                        </div>
                        <div class="grow"></div>
                        <div class="actions row between-xs middle-xs">
                            <p class="row date mb-0">
                                <i class="material-icons text-muted">date_range</i>
                                <span class="mx-2"><%= moment(listing.createdAt).format("ll") %></span>
                            </p>
                            <a href="/listing/<%= hyphenateString(listing.listingInfo.title) + "-"+ listing._id %>" class="mdc-button mdc-button--outlined">
                                <span class="mdc-button__ripple"></span>
                                <span class="mdc-button__label">Details</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <% }) %>
        <% function hyphenateString (str) {
            let pattern = " ";
            return str.split(' ').join('-').toLowerCase();
        } %>`,
    listingSearchComponent: `<% listings.forEach((listing, index) => { %>
        <div class="row item col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
            <div class="mdc-card property-item grid-item column-3">
                <div class="thumbnail-section">
                    <div class="row property-status">
                        <% for(let i = 0; i < listing.listingInfo.tags.length; i++) { %>
                        <% let tag = listing.listingInfo.tags[i]; %>
                        <% let color = tag === "FOR SALE" ? "green" :
                                                   tag === "FEATURED" ? "orange" :
                                                   tag === "FOR RENT" ? "blue" :
                                                   tag === "HOT OFFER" ? "red" :
                                                   tag === "SOLD" ? "dark" :
                                                   tag === "NEW" ? "teal" : ""
                                    %>
                        <span class="<%= color %>"><%= tag %></span>
                        <% } %>
                    </div>
                    <div class="property-image">
                        <div class="swiper-container">
                            <div class="swiper-wrapper">
                                <% listing.media.images.forEach((image) =>{ %>
                                <div class="swiper-slide">
                                    <img src="/assets/images/others/transparent-bg.png"
                                        alt="slide image <%= image %>"
                                        data-src="/uploads/listing/<%= listing._id %>/images/medium/<%= image %>"
                                        class="slide-item swiper-lazy">
                                    <div class="swiper-lazy-preloader"></div>
                                </div>
                                <% }); %>
                            </div>
                            <div class="swiper-pagination white"></div>
                            <button class="mdc-icon-button swiper-button-prev swipe-arrow"><i
                                    class="material-icons mat-icon-lg">keyboard_arrow_left</i></button>
                            <button class="mdc-icon-button swiper-button-next swipe-arrow"><i
                                    class="material-icons mat-icon-lg">keyboard_arrow_right</i></button>
                        </div>
                    </div>
                    <div class="control-icons">
                        <button class="mdc-button add-to-favorite" data-value="<%= listing._id %>"
                            title="Add To Favorite">
                            <i class="material-icons mat-icon-sm">favorite_border</i>
                        </button>
                        <button class="mdc-button add-to-compare" data-value="<%= listing._id %>"
                            title="Add To Compare">
                            <i class="material-icons mat-icon-sm">compare_arrows</i>
                        </button>
                    </div>
                </div>
                <div class="property-content-wrapper">
                    <div class="property-content">
                        <div class="content">
                            <h1 class="title">
                                <a href="/listing/<%= hyphenateString(listing.listingInfo.title) + "-"+ listing._id %>">
                                    <%= listing.listingInfo.title %>
                                </a>
                            </h1>
                            <p class="row address flex-nowrap">
                                <i class="material-icons text-muted">location_on</i>
                                <span><%= listing.location.sector + ", " + listing.location.city %></span>
                            </p>
                            <div class="row between-xs middle-xs">
                                <h3 class="primary-color price">
                                    <span><%= new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0,  maximumFractionDigits: 0 }).format(listing.price) %></span>
                                </h3>
                                <div class="row start-xs middle-xs ratings" title="29">
                                    <i class="material-icons mat-icon-sm">star</i>
                                    <i class="material-icons mat-icon-sm">star</i>
                                    <i class="material-icons mat-icon-sm">star</i>
                                    <i class="material-icons mat-icon-sm">star</i>
                                    <i class="material-icons mat-icon-sm">star_half</i>
                                </div>
                            </div>
                            <div class="d-none d-md-flex d-lg-flex d-xl-flex">
                                <div class="description mt-3">
                                    <p><%= listing.description %></p>
                                </div>
                            </div>
                            <div class="features mt-3">
                                <p><span>Property size</span><span><%= listing.propertyInfo.area %>
                                        ft²</span></p>
                                <p><span>Bedrooms</span><span><%= listing.propertyInfo.bedrooms %></span>
                                </p>
                                <p><span>Bathrooms</span><span><%= listing.propertyInfo.bathrooms %></span>
                                </p>
                                <p><span>Garages</span><span><%= listing.propertyInfo.reservedParking %></span>
                                </p>
                            </div>
                        </div>
                        <div class="grow"></div>
                        <div class="actions row between-xs middle-xs">
                            <p class="row date mb-0">
                                <i class="material-icons text-muted">date_range</i>
                                <span class="mx-2"><%= moment(listing.createdAt).format("ll") %> </span>
                            </p>
                            <a href="/listing/<%= hyphenateString(listing.listingInfo.title) + "-"+ listing._id %>"
                                class="mdc-button mdc-button--outlined">
                                <span class="mdc-button__ripple"></span>
                                <span class="mdc-button__label">Details</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <% }) %>
        <% function hyphenateString(str) {
            let pattern = " ";
            return str.split(' ').join('-').toLowerCase();
        } %>`,
    homeSearchTags: `<div id="home-search-tags" class="row start-xs middle-xs py-2 w-100">
            <div class="mdc-chip-set">
                <div class="mdc-chip bg-warn">
                    <div class="mdc-chip__ripple"></div>
                    <span>
                        <span role="button" tabindex="0" class="mdc-chip__text uppercase"><%= listingCount %> Found</span>
                    </span>
                </div>
                <% let excludedKeys = ["filter", "limit", "skip", "isListingSearch", "page"] %>
                <% for(key in tags) { %>
                    <% if (tags[key] && excludedKeys.indexOf(key) === -1 ) { %>
                    <div class="mdc-chip">
                        <div class="mdc-chip__ripple"></div>
                        <span>
                        <% let tagTitle = key.toUpperCase(); tagTitle = tagTitle.replace("TO", " <");
                            tagTitle = tagTitle.replace("FROM", " >");
                            tagTitle = ["SUBTYPE", "CITY", "BHK"].indexOf(tagTitle) > -1 ? "" : tagTitle + " ";
                        %>
                            <span role="button" tabindex="0" class="mdc-chip__text"><%= tagTitle + " " + tags[key] %></span>
                        </span>
                        <span>
                            <i data-value="<%= key %>" class="material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1"
                                role="button">cancel</i>
                        </span>
                    </div>
                    <% } %>
                <% } %>
            </div>
        </div>`,
    listingSearchTags: `<div id="home-search-tags" class="row start-xs middle-xs py-2 w-100">
            <div class="mdc-chip-set">
                <div class="mdc-chip bg-warn">
                    <div class="mdc-chip__ripple"></div>
                    <span>
                        <span role="button" tabindex="0" class="mdc-chip__text uppercase"><%= listingCount %> Found</span>
                    </span>
                </div>
                <% if(builderName) {%>
                    <div class="mdc-chip bg-warn">
                    <div class="mdc-chip__ripple"></div>
                    <span>
                        <span role="button" tabindex="0" class="mdc-chip__text uppercase"><%= builderName %></span>
                    </span>
                </div>
                <% } %>
                <% if(type) {%>
                <div class="mdc-chip bg-warn">
                    <div class="mdc-chip__ripple"></div>
                    <span>
                        <span role="button" tabindex="0" class="mdc-chip__text uppercase"><%= type %></span>
                    </span>
                </div>
                <% } %>
                <% let excludedKeys = ["filter", "limit", "skip", "builderId", "builderName", "isListingSearch", "type", "page", "isListingSearchSubtype"] %>
                <% for(key in tags) { %>
                    <% if (tags[key] && (excludedKeys.indexOf(key) === -1)) { %>
                    <div class="mdc-chip">
                        <div class="mdc-chip__ripple"></div>
                        <span>
                        <% let tagTitle = key.toUpperCase(); tagTitle = tagTitle.replace("TO", " <");
                            tagTitle = tagTitle.replace("FROM", " >");
                            tagTitle = ["SUBTYPE", "CITY", "BHK"].indexOf(tagTitle) > -1 ? "" : tagTitle + " ";
                        %>
                            <span role="button" tabindex="0" class="mdc-chip__text"><%= tagTitle + tags[key] %></span>
                        </span>
                        <span>
                            <i data-value="<%= key %>" class="material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1"
                                role="button">cancel</i>
                        </span>
                    </div>
                    <% } %>
                <% } %>
            </div>
        </div>`,
    paginationBar: `<div id="listing-pagination" class="row center-xs middle-xs p-2 w-100">
            <div class="mdc-card w-100">
                <ul class="theme-pagination">
                    <% let lastPage = parseInt((listingCount/limit) + (listingCount%limit > 0 ? 1 : 0)); %>
                    <li data-value="<%= pageNo - 1 %>"
                        class="pagination-previous <%= pageNo === 1 ? "disabled" : "" %>">
                        <span>Previous</span>
                    </li>
                    <% for(let i = 1; i <= lastPage; i++) { %>
                    <li data-value="<%= i %>" class="<%= pageNo === i ? "disabled current" : "" %>">
                        <span><%= i %></span>
                    </li>
                    <% } %>
                    <li data-value="<%= pageNo + 1 %>"
                        class="pagination-next <%= pageNo === lastPage ? "disabled" : "" %>">
                        <span>Next</span>
                    </li>
                </ul>
            </div>
        </div>`,
    loadMoreButton: `<div id="home-more-button" data-value="<%= pageNo + 1 %>" class="row center-xs middle-xs p-2 mt-2 w-100">
            <a class="mdc-button mdc-button--raised">
                <span class="mdc-button__ripple"></span>
                <span class="mdc-button__label">load more</span>
            </a>
        </div>`
}