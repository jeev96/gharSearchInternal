// Defaults
const DEFAULT_FILTER = 0;
const DEFAULT_LIMIT = document.getElementById("isListingSearch") ? 9 : 8;
const DEFAULT_SKIP = 0;
const DEFAULT_PAGE = 1;

// Query Extras
let formData = [];
let filter = DEFAULT_FILTER;
let limit = DEFAULT_LIMIT;
let skip = DEFAULT_SKIP;
let page = DEFAULT_PAGE;

function resetDefaults() {
    skip = DEFAULT_SKIP;
    page = DEFAULT_PAGE;
}

let snackbarElement = document.getElementById('snackbar');
const snackbar = mdc.snackbar.MDCSnackbar.attachTo(snackbarElement);

jQuery(document).ready(function () {
    onPageLoad()
});

function onPageLoad() {
    "use strict";

    const selector = '.mdc-button, .mdc-fab, .mdc-chip';
    const ripples = [].map.call(document.querySelectorAll(selector), function (el) {
        return mdc.ripple.MDCRipple.attachTo(el);
    });

    if (document.querySelector('.mdc-drawer.sidenav')) {
        const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer.sidenav'));
        $("#sidenav-toggle").on("click", function () {
            drawer.open = true;
        });
        $("#sidenav-close").on("click", function () {
            drawer.open = false;
        });
    };


    const dropDownMenus = Array.from(document.querySelectorAll('.mdc-menu-surface--anchor .mdc-menu')).filter(item => !item.parentNode.closest('.vertical-menu'));
    if (dropDownMenus.length) {
        dropDownMenus.forEach((dropDownMenu) => {
            const menu = new mdc.menu.MDCMenu(dropDownMenu);
            const dropdownToggle = dropDownMenu.parentElement.querySelector('.mdc-button');
            // menu.quickOpen = true;
            dropdownToggle.addEventListener('click', (e) => {
                e.preventDefault();
                menu.open = !menu.open;
            });
            dropDownMenu.addEventListener('mouseleave', () => {
                menu.open = false;
            });
            menu.setAnchorCorner(mdc.menu.Corner.BOTTOM_START);

            const options = $(dropDownMenu).find('.mdc-list-item');
            for (let option of options) {
                option.addEventListener('click', (event) => {
                    const mutable = $(dropdownToggle).find('.mdc-button__label > .mutable');
                    if (mutable.length) {
                        mutable[0].innerHTML = event.target.innerText;
                        filter = $(option).data('value') ? $(option).data('value') : filter;
                        limit = $(option).data('limit') ? $(option).data('limit') : limit;
                        resetDefaults();

                        searchListings(getFormData());
                    }
                });
            }
        });
    }

    const verticalMenuItems = Array.from(document.querySelectorAll('.vertical-menu .mdc-menu-surface--anchor .mdc-menu'));
    if (verticalMenuItems.length) {
        verticalMenuItems.forEach((menuItem) => {
            const menu = new mdc.menu.MDCMenu(menuItem);
            const dropdownToggle = menuItem.parentElement.querySelector('.mdc-button');
            menu.quickOpen = true;
            dropdownToggle.addEventListener('click', (e) => {
                e.preventDefault();
                menu.open = !menu.open;
            });
            menuItem.addEventListener('mouseleave', () => {
                menu.open = true;
            });
        });
    };

    $(window).on("scroll", function () {
        var top_toolbar_height = $('#top-toolbar').height();
        if ($(this).scrollTop() >= top_toolbar_height) {
            $('header').addClass('main-toolbar-fixed');
            $('main').addClass('main-toolbar-fixed');
        }
        else {
            $('header').removeClass('main-toolbar-fixed');
            $('main').removeClass('main-toolbar-fixed');
        };

        if ($(this).scrollTop() >= 300) {
            $('#back-to-top').addClass('show');
        }
        else {
            $('#back-to-top').removeClass('show');
        };
    });

    $('#back-to-top').on("click", function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });

    $("#options-toggle").on("click", function () {
        $(".options").toggleClass("show");
    });
    $('.options .skin-primary').on("click", function () {
        var skinurl = 'css/skins/' + $(this).attr('data-name') + '.css';
        $('link[rel="stylesheet"][href^="css/skins/"]').attr('href', skinurl);
        $(".options").removeClass("show");
    });

    var url_end = document.location.pathname.substring(document.location.pathname.lastIndexOf('/') + 1);
    $('.horizontal-menu a, .vertical-menu a').each(function (i) {
        if ($(this).attr('href') === url_end) {
            $(this).addClass('active-link');
        }
        else {
            $(this).removeClass('active-link');
        }
    });

    var header_carousel,
        property_item_carousel,
        testimonials_carousel,
        properties_carousel,
        agents_carousel,
        clients_carousel,
        compare_carousel,
        single_property_main_carousel,
        single_property_small_carousel;
    if (typeof Swiper !== "undefined") {
        header_carousel = new Swiper('.header-carousel .swiper-container', {
            slidesPerView: 1,
            spaceBetween: 0,
            keyboard: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: false,
            grabCursor: true,
            loop: true,
            preloadImages: false,
            lazy: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            speed: 500,
            effect: "slide"
        });

        setActiveSlideInfo(1);

        header_carousel.on('slideChange', function () {
            setActiveSlideInfo(header_carousel.activeIndex);
        });
        function setActiveSlideInfo(index) {
            if (header_carousel.slides) {
                var activeSlide = header_carousel.slides[index];
                var title = $(activeSlide).find("[data-slide-title]")[0].getAttribute("data-slide-title");
                var location = $(activeSlide).find("[data-slide-location]")[0].getAttribute("data-slide-location");
                var price = $(activeSlide).find("[data-slide-price]")[0].getAttribute("data-slide-price");
                $('#active-slide-info h1.slide-title').html(title);
                $('#active-slide-info .location span').html(location);
                $('#active-slide-info .mdc-button__label').html(price);
            }
        }

        property_item_carousel = new Swiper('.property-item .property-image>.swiper-container', {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 0,
            keyboard: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            grabCursor: true,
            loop: true,
            preloadImages: false,
            lazy: true,
            speed: 500,
            effect: "slide",
            nested: true
        });

        testimonials_carousel = new Swiper('.testimonials-carousel .swiper-container', {
            slidesPerView: 1,
            spaceBetween: 0,
            keyboard: true,
            navigation: true,
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            grabCursor: true,
            loop: true,
            preloadImages: true,
            lazy: false,
            speed: 500,
            effect: "slide"
        });

        properties_carousel = new Swiper('.properties-carousel>.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 16,
            keyboard: true,
            navigation: {
                nextEl: '.prop-next',
                prevEl: '.prop-prev',
            },
            breakpoints: {
                600: {
                    slidesPerView: 2
                },
                960: {
                    slidesPerView: 3
                },
                1280: {
                    slidesPerView: 4
                }
            },
            allowTouchMove: false
        });

        agents_carousel = new Swiper('.agents-carousel .swiper-container', {
            slidesPerView: 1,
            spaceBetween: 16,
            keyboard: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            grabCursor: true,
            loop: true,
            preloadImages: false,
            lazy: true,
            breakpoints: {
                600: {
                    slidesPerView: 2
                },
                960: {
                    slidesPerView: 3
                },
                1280: {
                    slidesPerView: 4
                }
            }
        });

        clients_carousel = new Swiper('.clients-carousel .swiper-container', {
            slidesPerView: 1,
            spaceBetween: 16,
            keyboard: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            grabCursor: true,
            loop: true,
            preloadImages: false,
            lazy: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false
            },
            speed: 500,
            effect: "slide",
            breakpoints: {
                320: {
                    slidesPerView: 2
                },
                480: {
                    slidesPerView: 3
                },
                600: {
                    slidesPerView: 4
                },
                960: {
                    slidesPerView: 5
                },
                1280: {
                    slidesPerView: 6
                },
                1500: {
                    slidesPerView: 7
                }
            }
        });

        compare_carousel = new Swiper('.compare-carousel .swiper-container', {
            slidesPerView: 1,
            spaceBetween: 16,
            keyboard: true,
            navigation: {
                nextEl: '.prop-next',
                prevEl: '.prop-prev',
            },
            breakpoints: {
                600: {
                    slidesPerView: 2
                },
                960: {
                    slidesPerView: 3
                },
                1280: {
                    slidesPerView: 4
                }
            },
            allowTouchMove: false
        });

        single_property_main_carousel = new Swiper('.single-property .main-carousel .swiper-container', {
            slidesPerView: 1,
            spaceBetween: 0,
            keyboard: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: false,
            grabCursor: true,
            loop: false,
            preloadImages: false,
            lazy: true,
            speed: 500,
            effect: "slide"
        });

        single_property_small_carousel = new Swiper('.single-property .small-carousel .swiper-container', {
            slidesPerView: 1,
            spaceBetween: 16,
            keyboard: true,
            pagination: false,
            preloadImages: false,
            grabCursor: true,
            lazy: true,
            breakpoints: {
                320: {
                    slidesPerView: 2
                },
                480: {
                    slidesPerView: 3
                },
                600: {
                    slidesPerView: 4
                }
            },
            allowTouchMove: true
        });

        if (single_property_main_carousel.slides && single_property_small_carousel.slides) {
            setTimeout(() => {
                single_property_main_carousel.update();
                single_property_small_carousel.update();
            }, 100);
            single_property_main_carousel.on('slideChange', function () {
                single_property_small_carousel.slideTo(single_property_main_carousel.activeIndex);
            });
            $('.single-property .small-carousel .swiper-slide').on('click', function () {
                single_property_main_carousel.slideTo($(this).index());
            });
        };

    };

    const filterTextFields = [].map.call(document.querySelectorAll('#filters .mdc-text-field'), function (el) {
        return mdc.textField.MDCTextField.attachTo(el);
    });

    const filterSelectFields = [].map.call(document.querySelectorAll('#filters .mdc-select'), function (el) {
        return mdc.select.MDCSelect.attachTo(el);
    });

    const filterCheckboxes = [].map.call(document.querySelectorAll('#filters .mdc-checkbox'), function (el) {
        return mdc.checkbox.MDCCheckbox.attachTo(el);
    });

    $("#phone").on("click", function () {
        $("#phone").val("+91 ");
    })

    $(".mdc-chip span i").on("click", function () {
        tagSearch($(this).data("value"));
    });

    $("#listing-pagination li").on("click", function () {
        if ($(this).hasClass("disabled")) {
            return;
        }
        paginationSearch($(this).data("value"));
    });

    $("#home-more-button").on("click", function () {
        loadMoreSearch($(this).data("value"));
    });

    $(".delete-user").submit(function (event) {
        let answer = confirm("Delete User " + $(this).data("value") + " ?");
        if (answer) {
            console.log("Delete user called");
        }
        else {
            event.preventDefault();
        }
    });

    $("#listing-submit-button").on("click", function (event) {
        if (!checkFormValidity($(this).parent().parent().parent())) {
            return;
        }
        const formData1 = getFilterFormData("#listing-submit-form-1");
        const formData2 = getFilterFormData("#listing-submit-form-2");
        const formData3 = getFilterFormData("#listing-submit-form-3");
        const formData = formData1.concat(formData2, formData3);
        $.post("/listing/submit", formData, function () {
            console.log("Request sent...");
        }).done((data) => {
            console.log("Success");
            $("#upload-listing-id").val(data.id);
            showSnackbar("Listing Saved.");
            return;
        }).fail((error) => {
            console.log(error.responseText);
            showSnackbar("There was an error. Please check your fields and Retry");
            return;
        });
    });

    $("#listing-submit-form-4").submit(function (event) {
        const formData = getFilterFormData("#listing-submit-form-4");
        console.log(formData);
    });

    $("#listing-edit-form").submit(function (event) {
        let extraValues = $("#listing-edit-form li.mdc-list-item--selected");
        for (let i = 0; i < extraValues.length; i++) {
            let inputHtml = `<input type="hidden" name="${$(extraValues[i]).parent().attr("name")}" value="${$(extraValues[i]).data("value")}" />`
            $("#listing-edit-form").append(inputHtml);
        }
    });

    $("#filters").submit(function (event) {
        event.preventDefault();
        const searchString = getFilterFormData("#filters");
        formData = searchString;
        searchListings(searchString);
        goToTop();
    });

    $("#register").submit(function (event) {
        let userType = $("#register li.mdc-list-item--selected");
        $("#userType").val($(userType[0]).data("value"))
    });

    $("#leads").submit(function (event) {
        event.preventDefault();
        let inputData = $("#leads").serializeArray()
        $.post("/lead", inputData, function () {
            console.log("Request sent...");
        }).done((data) => {
            console.log("Success");
            $("#lead-success").text("Request Sent. You will be contacted shortly.");
            $("#lead-success").removeClass("d-none warn-color");
            $("#lead-success").addClass("primary-color");
            $("#leads").trigger("reset");
            return;
        }).fail((error) => {
            console.log("Faliure");
            $("#lead-success").text("Some Error Occurred. Try Again");
            $("#lead-success").removeClass("d-none primary-color");
            $("#lead-success").addClass("warn-color");
            return;
        });
    });

    $("#loan-calculator").submit(function (event) {
        event.preventDefault();
        let data = {}
        $.each($("#loan-calculator").serializeArray(), function (_, kv) {
            data[kv.name] = kv.value;
        });

        let loanDetails = getLoanDetails(data);

        $("#monthly-payment").text("Monthly Payment " + formatCurrency(loanDetails.monthlyPayment));
        $("#total-payment").text(formatCurrency(loanDetails.totalPayment));
        $("#total-interest").text(formatCurrency(loanDetails.totalInterest));
        $("#interest-ratio").text(loanDetails.interestRatio + "%");

        $("#loan-details").removeClass("d-none");
    });

    function getFormData(isTagFetch) {
        if (formData.length === 0) {
            formData = $("#filters").serializeArray();
            if (!isTagFetch && $("#isListingSearchSubtype").length === 1) {
                formData.push({ name: "subType", value: $("#isListingSearchSubtype").attr("value") });
            }
        }
        return formData;
    }

    function checkFormValidity(tab) {
        let form = $(tab).find("form")
        if (form.length > 0) {
            return $(form).get(0).reportValidity();
        }
        return true;
    }

    function tagSearch(key) {
        let searchString = getFormData(true);
        let removeValue = key;

        for (let i = 0; i < searchString.length; i++) {
            let element = searchString[i];
            if (element.name === removeValue) {
                searchString.splice(i, 1);
                break;
            }
        }
        searchListings(searchString);
    }

    function paginationSearch(newPage) {
        page = newPage;
        skip = (newPage - 1) * limit;

        searchListings(getFormData());
        goToTop();
    }

    function loadMoreSearch(newPage) {
        limit = newPage * parseInt($("#selected-limit").text());
        page = newPage;
        searchListings(getFormData());
    }

    function getFilterFormData(formName) {
        let searchString = $(formName).serializeArray();
        let inputData = $(formName + " li.mdc-list-item--selected");
        for (let i = 0; i < inputData.length; i++) {
            searchString.push({
                name: $(inputData[i]).parent().attr("name"),
                value: $(inputData[i]).data("value")
            });
        }
        return searchString;
    }

    function searchListings(searchString) {
        addExtraQueryParams(searchString);

        $.post("/listing/search", searchString, function () {
            console.log("Request sent...");
        }).done((data) => {
            removeExtraQueryParams(searchString);
            data.isListingSearch ? populateListingContent(data) : populateHomeContent(data);
            reInitOptions();
            return;
        }).fail((error) => {
            console.log(error.responseText);
            showSnackbar("There was an error. Please check your fields and Retry");
            return;
        });
    }

    function addExtraQueryParams(searchString) {
        searchString.push({ name: "filter", value: filter });
        searchString.push({ name: "limit", value: limit });
        searchString.push({ name: "skip", value: skip });
        searchString.push({ name: "page", value: page });
    }

    function removeExtraQueryParams(searchString) {
        searchString.splice(searchString.length - 4, 4)
    }

    function goToTop() {
        $("html, body").animate({ scrollTop: $("#filters").offset().top }, "slow");
    }

    function populateHomeContent(data) {
        let sortBar = $("#home-sort");
        $("#home-listings").empty();
        $("#home-listings").append($(data.tagsHtml));
        $("#home-listings").append($(sortBar));
        $("#home-listings").append($(data.listingsHtml));
        $("#home-listings").append($(data.loadButton));
        return;
    }

    function populateListingContent(data) {
        let sortBar = $("#home-sort");
        $("#home-listings").empty();
        $("#home-listings").append($(sortBar));
        $("#home-listings").append($(data.tagsHtml));
        $("#home-listings").append($(data.listingsHtml));
        $("#home-listings").append($(data.paginationBar));
        return;
    }

    function getLoanDetails(data) {
        let principal = parseFloat(data.principal);
        let interest = parseFloat(data.interest);
        let term = parseFloat(data.term);

        let percentageRate = interest / 1200;
        let lengthOfLoan = 12 * term;
        let monthlyPayment = (principal * percentageRate) / (1 - (Math.pow((1 + percentageRate), lengthOfLoan * -1)));
        let totalPayment = monthlyPayment * lengthOfLoan;
        let totalInterest = (monthlyPayment * lengthOfLoan) - principal;
        let interestRatio = (totalInterest / totalPayment) * 100;
        return {
            monthlyPayment: monthlyPayment.toFixed(2),
            totalPayment: totalPayment.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
            interestRatio: interestRatio.toFixed(2)
        }
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-IN',
            {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value)
    }

    [].slice.call(document.querySelectorAll('.mdc-chip-set')).forEach(function (el) {
        mdc.chips.MDCChipSet.attachTo(el);
    });
    [].slice.call(document.querySelectorAll('.mdc-switch')).forEach(function (el) {
        mdc.switchControl.MDCSwitch.attachTo(el);
    });


    if (filterTextFields.length) {
        $('#show-more-filters').on("click", function () {
            $('#more-filters').toggleClass('d-none');
            $('#show-more-filters').toggleClass('d-none');
            $('#hide-more-filters').toggleClass('d-none');
        });
        $('#hide-more-filters').on("click", function () {
            $('#more-filters').toggleClass('d-none');
            $('#show-more-filters').toggleClass('d-none');
            $('#hide-more-filters').toggleClass('d-none');
        });
        $('#clear-filter').on("click", function () {
            filterSelectFields.forEach(function (select) {
                select.value = '';
            });
            filterTextFields.forEach(function (field) {
                field.value = '';
            });
            filterCheckboxes.forEach(function (checkbox) {
                checkbox.checked = false;
            });
        });
    };

    $('.view-type').on("click", function () {
        setViewModes(this);
    });
    function setViewModes(views) {
        var viewType = views.getAttribute('data-view-type');
        var colSize = views.getAttribute('data-col');
        var fullWidthPage = views.getAttribute('data-full-width-page');
        var col = '';
        switch (colSize) {
            case '1':
                col = 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12';
                break;
            case '2':
                col = 'col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6';
                break;
            case '3':
                col = (fullWidthPage == 'true') ? 'col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4' : 'col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-4';
                break;
            case '4':
                col = 'col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3';
                break;
            default:
                col = 'col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3';
                break;
        };
        $('.properties-wrapper .item').removeClass().addClass('row item ' + col);
        var property_item_class = 'mdc-card property-item ' + viewType + '-item ' + 'column-' + colSize;
        if (fullWidthPage == 'true') {
            property_item_class = property_item_class + ' full-width-page';
        }
        $('.properties-wrapper .mdc-card.property-item').removeClass().addClass('mdc-card property-item ' + property_item_class);
        if (property_item_carousel.length) {
            for (let carousel of property_item_carousel) {
                if (carousel.slides) {
                    carousel.update();
                }
            }
        }
    }

    function reInitOptions() {
        property_item_carousel = null;
        property_item_carousel = new Swiper('.property-item .property-image>.swiper-container', {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 0,
            keyboard: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            grabCursor: true,
            loop: true,
            preloadImages: false,
            lazy: true,
            speed: 500,
            effect: "slide",
            nested: true
        })

        let chips = document.querySelectorAll('.mdc-chip-set');
        chips.forEach(function (el) {
            mdc.chips.MDCChipSet.attachTo(el);
        });

        $(".mdc-chip span i").on("click", function () {
            tagSearch($(this).data("value"));
        });

        $('.view-type').on("click", function () {
            setViewModes(this);
        });

        $("#home-more-button").on("click", function () {
            loadMoreSearch($(this).data("value"));
        });

        $("#listing-pagination li").on("click", function () {
            if ($(this).hasClass("disabled")) {
                return;
            }
            paginationSearch($(this).data("value"));
        });

        initSidenav();
        initAddToFavorites();
        initAddToCompare();
    }

    $(".subscribe-input").on("focus", function () {
        $(this).parent().addClass("active");
    }).blur(function () {
        $(this).parent().removeClass("active");
    });

    const footerFeedbackFormFields = [].map.call(document.querySelectorAll('footer .feedback-form .mdc-text-field'), function (el) {
        return mdc.textField.MDCTextField.attachTo(el);
    });
    const contactFormFields = [].map.call(document.querySelectorAll('.contact-form .mdc-text-field'), function (el) {
        return mdc.textField.MDCTextField.attachTo(el);
    });
    const customTextFields = [].map.call(document.querySelectorAll('.mdc-text-field.custom-field'), function (el) {
        return mdc.textField.MDCTextField.attachTo(el);
    });
    const customSelectFields = [].map.call(document.querySelectorAll('.mdc-select.custom-field'), function (el) {
        return mdc.select.MDCSelect.attachTo(el);
    });
    const submitPropertyTextFields = [].map.call(document.querySelectorAll('.submit-property .mdc-text-field'), function (el) {
        return mdc.textField.MDCTextField.attachTo(el);
    });
    const submitPropertySelectFields = [].map.call(document.querySelectorAll('.submit-property .mdc-select'), function (el) {
        return mdc.select.MDCSelect.attachTo(el);
    });

    $('.password-toggle').on("click", function () {
        var input = $(this).parent().find('input')[0];
        if (this.innerHTML == 'visibility') {
            this.innerHTML = 'visibility_off';
            input.type = 'password';
        }
        else {
            this.innerHTML = 'visibility';
            input.type = 'text';
        }
    });

    function initSidenav() {
        if (document.querySelector('.mdc-drawer.page-sidenav')) {
            const drawerElement = document.querySelector('.mdc-drawer.page-sidenav');
            const drawerScrim = document.querySelector('.page-sidenav-scrim')
            const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer.page-sidenav'));
            $("#page-sidenav-toggle").on("click", function () {
                drawer.open = true;
            });
            $("#page-sidenav-close-button").on("click", function () {
                drawer.open = false;
            });
            const initPermanentDrawer = () => {
                drawerElement.classList.remove("mdc-drawer--modal");
                drawerElement.classList.add("mdc-drawer--dismissible");
                drawerScrim.classList.add("d-none");
                const drawer = mdc.drawer.MDCDrawer.attachTo(drawerElement);
                drawer.open = true;
                return drawer;
            }
            const initModalDrawer = () => {
                $("#page-sidenav-close").removeClass("d-none");
                drawerElement.classList.remove("mdc-drawer--dismissible");
                drawerElement.classList.add("mdc-drawer--modal");
                drawerScrim.classList.remove("d-none");
                const drawer = mdc.drawer.MDCDrawer.attachTo(drawerElement);
                // drawer.open = false;
                return drawer;
            }
            window.matchMedia("(max-width: 959px)").matches ? initModalDrawer() : initPermanentDrawer();

            const resizeHandler = () => {
                if (window.matchMedia("(max-width: 959px)").matches) {
                    initModalDrawer();
                } else if (window.matchMedia("(min-width: 959px)").matches) {
                    initPermanentDrawer();
                }
            }

            window.addEventListener('resize', resizeHandler);
        };
    }
    initSidenav();

    $('.expansion-panel').each(function (i) {
        if (i === 0) {
            $(this).addClass("expanded");
            $(this).find('.expansion-panel-body').slideDown('fast');
        }
        else {
            $(this).find('.expansion-panel-body').slideUp('fast');
        }
    });
    $('.expansion-panel .expansion-panel-header').on("click", function () {
        var panel_body = $(this).parent().find('.expansion-panel-body');
        if (panel_body.is(":visible")) {
            $(this).parent().removeClass("expanded");
            panel_body.slideUp('fast');
        }
        else {
            $(this).parent().addClass("expanded");
            panel_body.slideDown('fast');
        }
    });

    const tabBars = Array.from(document.querySelectorAll('.mdc-tab-bar'));
    if (tabBars.length) {
        tabBars.forEach((bar) => {
            const tabBar = new mdc.tabBar.MDCTabBar(bar);
            var contents = bar.parentElement.querySelectorAll('.tab-content');
            tabBar.listen('MDCTabBar:activated', function (event) {
                bar.parentElement.querySelector('.tab-content--active').classList.remove('tab-content--active');
                contents[event.detail.index].classList.add('tab-content--active');
            });
            contents.forEach((content, index) => {
                const next = content.querySelector('.next-tab');
                const prev = content.querySelector('.prev-tab');
                if (next) {
                    next.addEventListener('click', () => {
                        if (checkFormValidity(content)) {
                            tabBar.activateTab(index + 1);
                        }
                    });
                }
                if (prev) {
                    prev.addEventListener('click', () => {
                        tabBar.activateTab(index - 1);
                    });
                }
            });
        });
    };

    $('#view-demos').on("click", function () {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#demos").offset().top
        }, 'slow');
    });

    if (getUrlParameter('skin')) {
        var skinurl = 'css/skins/' + getUrlParameter('skin') + '.css';
        $('link[rel="stylesheet"][href^="css/skins/"]').attr('href', skinurl);
    };

    $(".add-step").on("click", function (event) {
        var template = $(this).attr('data-template-name');
        var dynamic_steps = $(this).closest(".dynamic-steps");
        var steps = dynamic_steps.find('.steps')[0];
        $($("#" + template).html()).appendTo($(steps)).show("slow");
        var i = parseInt(dynamic_steps.find('.steps').find('.num:last').text()) + 1;
        i = isNaN(i) ? 1 : i;
        $($("<span class='num'> " + i + " </span>")).appendTo($(".number")).closest("div").removeClass('number');
        [].map.call(document.querySelectorAll('.submit-property .mdc-text-field'), function (el) {
            mdc.textField.MDCTextField.attachTo(el);
        });
        [].map.call(document.querySelectorAll('.submit-property .mdc-select'), function (el) {
            mdc.select.MDCSelect.attachTo(el);
        });
        dynamic_steps.find('#plan-image').attr("id", "plan-image-" + i);
        initDropzonePlanImage(i);
        preventImageNameKeypress();
        event.preventDefault();
    });
    $(document).on("click", ".remove-step", function (event) {
        if ($(this).parent().parent().find(".dz-remove")[0]) {
            $(this).parent().parent().find(".dz-remove")[0].click();
        }
        $(this).closest(".step-section").remove();
    });

    $('.time').text(formatAMPM(new Date));
    setInterval(function () {
        $('.time').text(formatAMPM(new Date));
    }, 1000);

    function initAddToFavorites() {
        $('.add-to-favorite').on('click', function () {
            $.post('/listingOperation/favourite', { id: $(this).data("value") }, function (data, status, xhr) {
                console.log('Request sent!');
            }).done(function () {
                console.log('Request done!');
                let count = Number($('#favourite-header').text());
                $('#favourite-header').text(count + 1);
                $('#favourite-menubar').text(count + 1);
                showSnackbar('The property has been added to favorites.');
            }).fail(function (jqxhr, settings, ex) {
                console.log('failed, ' + ex);
                if (jqxhr.status === 409) {
                    showSnackbar('The property has already been added.');
                } else {
                    showSnackbar('Some error occurred.');
                }
            });
        });
    }

    function initAddToCompare() {
        $('.add-to-compare').on('click', function () {
            $.post('/listingOperation/compare', { id: $(this).data("value") }, function (data, status, xhr) {
                console.log('Request sent!');
            }).done(function () {
                console.log('Request done!');
                let count = Number($('#compare-header').text());
                $('#compare-header').text(count + 1);
                $('#compare-menubar').text(count + 1);
                showSnackbar('The property has been added to compare.');
            }).fail(function (jqxhr, settings, ex) {
                console.log('failed, ' + ex);
                if (jqxhr.status === 409) {
                    showSnackbar('The property has already been added.');
                } else {
                    showSnackbar('Some error occurred.');
                }
            });
        });
    }

    initAddToFavorites();
    initAddToCompare();

    // favourite methods
    $('.favourite-remove').on('click', function () {
        let button = $(this);
        $.ajax({
            url: '/listingOperation/favourite/' + $(this).data("value"),
            type: 'DELETE',
            success: function (result) {
                let count = Number($('#favourite-count').text());
                $('#favourite-count').text(count - 1);
                $('#favourite-header').text(count - 1);
                $('#favourite-menubar').text(count - 1);
                button.parent().parent().remove();
            }
        });
    });
    $('#favourite-clear').on('click', function () {
        $.ajax({
            url: '/listingOperation/favourite',
            type: 'DELETE',
            success: function (result) {
                $('#favourite-count').text("0");
                $('#favourite-header').text("0");
                $('#favourite-menubar').text("0");
                $('#favourite-list').empty();
            }
        });

    });

    // compare methods
    $('.compare-remove').on('click', function () {
        let button = $(this);
        $.ajax({
            url: '/listingOperation/compare/' + $(this).data("value"),
            type: 'DELETE',
            success: function (result) {
                let count = Number($('#compare-count').text());
                $('#compare-count').text(count - 1);
                $('#compare-header').text(count - 1);
                $('#compare-menubar').text(count - 1);
                button.parent().parent().parent().remove();
            }
        });
    });
    $('#compare-clear').on('click', function () {
        $.ajax({
            url: '/listingOperation/compare',
            type: 'DELETE',
            success: function (result) {
                $('#compare-count').text("0");
                $('#compare-header').text("0");
                $('#compare-menubar').text("0");
                $('#compare-list').empty();
            }
        });
    });

    function preventImageNameKeypress() {
        $('input[name=planImages]').keydown(function (e) {
            e.preventDefault();
        });
        $('input[name=image]').keydown(function (e) {
            e.preventDefault();
        });
    }
    preventImageNameKeypress();

    $('#upload-listing-id').keydown(function (e) {
        e.preventDefault();
    });

    let snackbarSuccessElement = document.getElementById('snackbar-success');
    if (snackbarSuccessElement) {
        const snackbarSuccess = mdc.snackbar.MDCSnackbar.attachTo(snackbarSuccessElement);
        snackbarSuccess.open();
    }

    let snackbarErrorElement = document.getElementById('snackbar-error');
    if (snackbarErrorElement) {
        const snackbarError = mdc.snackbar.MDCSnackbar.attachTo(snackbarErrorElement);
        snackbarError.open();
    }
}

function showSnackbar(message) {
    snackbar.labelText = message;
    snackbar.open();
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime;
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

// Maps markers
let conatct_marker;
function initMap() {
    let myLatLng = { lat: 40.678178, lng: -73.944158 };

    if (document.getElementById('listing-map')) {
        let listingLatLon = { lat: parseFloat($("#listing-lat").val()), lng: parseFloat($("#listing-lon").val()) };
        let listing_map = new google.maps.Map(document.getElementById('listing-map'), {
            center: listingLatLon,
            zoom: 12,
            mapTypeControl: false,
            fullscreenControl: false,
        });
        let marker = new google.maps.Marker({
            position: listingLatLon,
            map: listing_map,
            title: 'Property Location'
        });
    }
    if (document.getElementById('location-map')) {
        let location_map = new google.maps.Map(document.getElementById('location-map'), {
            center: myLatLng,
            zoom: 15,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "saturation": 36
                        },
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 40
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 16
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 20
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 17
                        },
                        {
                            "weight": 1.2
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#8b9198"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 20
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#323336"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#414954"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 21
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#2e2f31"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#7a7c80"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#242427"
                        },
                        {
                            "lightness": 17
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#202022"
                        },
                        {
                            "lightness": 29
                        },
                        {
                            "weight": 0.2
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 18
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#393a3f"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#202022"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 16
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#393a3f"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#202022"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 19
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 17
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#202124"
                        }
                    ]
                }
            ]
        });
        let marker = new google.maps.Marker({
            position: myLatLng,
            map: location_map,
            title: 'Our office'
        });
    }
    if (document.getElementById('contact-map')) {
        let contact_map = new google.maps.Map(document.getElementById('contact-map'), {
            center: myLatLng,
            zoom: 12
        });
        const input = document.getElementById("maps-search");
        const searchBox = new google.maps.places.SearchBox(input);
        conatct_marker = new google.maps.Marker({
            position: myLatLng,
            map: contact_map,
            title: 'Our office'
        });
        // setFormPositions(myLatLng);
        google.maps.event.addListener(contact_map, 'click', function (event) {
            placeMarker(contact_map, event.latLng);
        });

        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();

            conatct_marker.setMap(null);

            const bounds = new google.maps.LatLngBounds();
            places.forEach(place => {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                const icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                }; // Create a marker for each place.

                conatct_marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: contact_map
                });
                setFormPositions(place.geometry.location);

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            contact_map.fitBounds(bounds);
        });
    }
}

function placeMarker(map, location) {
    conatct_marker.setMap(null);
    setFormPositions(location);
    conatct_marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

function setFormPositions(location) {
    $("#latitude").val(location.lat);
    $("#longitude").val(location.lng);
}

window.addEventListener('load', function () {
    if (!document.getElementById('preloader'))
        return;
    var s = document.getElementById('preloader').style;
    s.opacity = 1;
    (function fade() {
        (s.opacity -= .1) < 0 ? s.display = "none" : setTimeout(fade, 20)
    })();
    $('html, body').animate({ scrollTop: 0 }, 'slow');
});

function initDropzonePropertyImages() {
    if ($('#property-images').length) {
        let property_images = new Dropzone('#property-images', {
            autoProcessQueue: false,
            addRemoveLinks: true,
            uploadMultiple: false,
            acceptedFiles: 'image/*',
            url: '/media/upload',
            paramName: 'image',
            previewTemplate: document.querySelector('#dropzone-preview-template').innerHTML,
            parallelUploads: 8,
            thumbnailHeight: 120,
            thumbnailWidth: 120,
            maxFilesize: 5,
            maxFiles: 8,
            dictRemoveFile: `<svg viewBox="0 0 24 24">
                                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </svg>`,
            dictCancelUpload: `<svg viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z" />
                                </svg>`,
            filesizeBase: 1000,
            init: function () {
                if ($('input[name=images]').length === 0) {
                    return;
                }
                let images = $('input[name=images]');
                for (let i = 0; i < images.length; i++) {
                    let image = $(images[i]).val();
                    let file = {
                        processing: true,
                        accepted: true,
                        name: image,
                        size: 5000000,
                        type: 'image/jpeg',
                        status: Dropzone.SUCCESS
                    }
                    let thumbnailUrl = `/uploads/listing/${$("input[name=listingId]").val()}/images/raw/${image}`
                    this.files.push(file);
                    this.emit("addedfile", file);
                    this.emit("thumbnail", file, thumbnailUrl);
                    this.emit("processing", file);
                    this.emit("success", file, { status: "success" }, false);
                    this.emit("complete", file);
                }
            },
            thumbnail: function (file, dataUrl) {
                if (file.previewElement) {
                    file.previewElement.classList.remove("dz-file-preview");
                    let images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                    for (let i = 0; i < images.length; i++) {
                        let thumbnailElement = images[i];
                        thumbnailElement.alt = file.name;
                        thumbnailElement.src = dataUrl;
                    }
                    setTimeout(function () { file.previewElement.classList.add("dz-image-preview"); }, 1);
                }
            },
        });

        property_images.on('sending', function (file, xhr, formData) {
            formData.append('listingId', $("#upload-listing-id").val());
        });

        property_images.on("complete", function (file) {
            if (file.status !== "success") {
                return;
            }
            $("#listing-submit-form-4").append(`<input type="hidden" name="images" value="${file.name}" />`);
            $("#listing-edit-form").append(`<input type="hidden" name="images" value="${file.name}" />`);
            showSnackbar("Image Uploaded. Please submit Changes.")
        });

        property_images.on('removedfile', function (file) {
            if (file.status !== "success") {
                return;
            }

            $('input[type=hidden]').each(function () {
                if ($(this).val() === file.name) {
                    $(this).remove();
                }
            });
            let data = {
                listingId: $("#upload-listing-id").val(),
                imageName: file.name
            }
            $.post("/media/removeListingImage", data, function (result, status) {
            }).done((response) => {
                console.log("Message: " + response);
                showSnackbar("Image Deleted. Please submit Changes.")
            }).fail((error) => {
                console.log("Error: " + error.responseText);
                showSnackbar(error.responseText)
            });
        });

        $('#upload-images-button').on('click', function () {
            if ($("#upload-listing-id").val() !== "") {
                property_images.processQueue();
            }
            property_images.processQueue();
        });
    }
}

function initDropzonePlanImage(index) {
    if ($('#plan-image-' + index).length) {
        let plan_image = new Dropzone('#plan-image-' + index, {
            autoProcessQueue: true,
            addRemoveLinks: true,
            acceptedFiles: 'image/*',
            url: '/media/uploadPlan',
            paramName: 'planImage',
            previewTemplate: document.querySelector('#dropzone-preview-template').innerHTML,
            parallelUploads: 1,
            thumbnailHeight: 120,
            thumbnailWidth: 120,
            maxFilesize: 5,
            maxFiles: 1,
            dictRemoveFile: `<svg viewBox="0 0 24 24">
                                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </svg>`,
            dictCancelUpload: `<svg viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z" />
                                </svg>`,
            filesizeBase: 1000,
            init: function () {
                let imageElement = $('#plan-image-' + index).parent().parent().find('input[name=planImages]');
                if (imageElement.length === 0 || $(imageElement).val() === "") {
                    return;
                }
                let image = $(imageElement).val();
                let file = {
                    processing: true,
                    accepted: true,
                    name: image,
                    size: 5000000,
                    type: 'image/jpeg',
                    status: Dropzone.SUCCESS
                }
                let thumbnailUrl = `/uploads/listing/${$("input[name=listingId]").val()}/plans/${image}`
                this.files.push(file);
                this.emit("addedfile", file);
                this.emit("thumbnail", file, thumbnailUrl);
                this.emit("processing", file);
                this.emit("success", file, { status: "success" }, false);
                this.emit("complete", file);

            },
            thumbnail: function (file, dataUrl) {
                if (file.previewElement) {
                    file.previewElement.classList.remove("dz-file-preview");
                    let images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                    for (let i = 0; i < images.length; i++) {
                        let thumbnailElement = images[i];
                        thumbnailElement.alt = file.name;
                        thumbnailElement.src = dataUrl;
                    }
                    setTimeout(function () { file.previewElement.classList.add("dz-image-preview"); }, 1);
                }
            },
        });

        plan_image.on('sending', function (file, xhr, formData) {
            formData.append('listingId', $("#upload-listing-id").val());
        });

        plan_image.on("complete", function (file) {
            if (file.status !== "success") {
                return;
            }
            $("#plan-image-" + index).parent().parent().find("input[name=planImages]").val(file.name);
            showSnackbar("Image Uploaded. Please submit Changes.")
        });

        plan_image.on('removedfile', function (file) {
            if (file.status !== "success") {
                return;
            }

            $("#plan-image-" + index).parent().parent().find("input[name=planImages]").val("");
            let data = {
                listingId: $("#upload-listing-id").val(),
                imageName: file.name
            }
            $.post("/media/removePlanImage", data, function (result, status) {
            }).done((response) => {
                console.log("Message: " + response);
                showSnackbar("Image Deleted. Please submit Changes.")
            }).fail((error) => {
                console.log("Error: " + error.responseText);
                showSnackbar(error.responseText)
            });
        });
    }
}

function initDropzoneBuilderImage() {
    if ($('#builder-image').length) {
        let builder_image = new Dropzone('#builder-image', {
            autoProcessQueue: true,
            addRemoveLinks: true,
            acceptedFiles: 'image/*',
            url: '/media/uploadBuilder',
            paramName: 'agentImage',
            previewTemplate: document.querySelector('#dropzone-preview-template').innerHTML,
            parallelUploads: 1,
            thumbnailHeight: 120,
            thumbnailWidth: 120,
            maxFilesize: 5,
            maxFiles: 1,
            dictRemoveFile: `<svg viewBox="0 0 24 24">
                                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </svg>`,
            dictCancelUpload: `<svg viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z" />
                                </svg>`,
            filesizeBase: 1000,
            init: function () {
                let imageElement = $('#builder-image').parent().parent().find('input[name=image]');
                if (imageElement.length === 0 || $(imageElement).val() === "") {
                    return;
                }
                let image = $(imageElement).val();
                let file = {
                    processing: true,
                    accepted: true,
                    name: image,
                    size: 5000000,
                    type: 'image/jpeg',
                    status: Dropzone.SUCCESS
                }
                let thumbnailUrl = `/uploads/builder/${$("input[name=builderId]").val()}/${image}`
                this.files.push(file);
                this.emit("addedfile", file);
                this.emit("thumbnail", file, thumbnailUrl);
                this.emit("processing", file);
                this.emit("success", file, { status: "success" }, false);
                this.emit("complete", file);

            },
            thumbnail: function (file, dataUrl) {
                if (file.previewElement) {
                    file.previewElement.classList.remove("dz-file-preview");
                    let images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                    for (let i = 0; i < images.length; i++) {
                        let thumbnailElement = images[i];
                        thumbnailElement.alt = file.name;
                        thumbnailElement.src = dataUrl;
                    }
                    setTimeout(function () { file.previewElement.classList.add("dz-image-preview"); }, 1);
                }
            },
        });

        builder_image.on('sending', function (file, xhr, formData) {
            formData.append('builderId', $("#upload-builder-id").val());
        });

        builder_image.on("complete", function (file) {
            if (file.status !== "success") {
                return;
            }
            $("#builder-image").parent().parent().find("input[name=image]").val("agentImage.jpg");
            showSnackbar("Image Uploaded. Please submit Changes.")
        });

        builder_image.on('removedfile', function (file) {
            if (file.status !== "success") {
                return;
            }

            $("#builder-image").parent().parent().find("input[name=image]").val("");
            let data = {
                builderId: $("#upload-builder-id").val(),
                imageName: file.name
            }
            $.post("/media/removeBuilderImage", data, function (result, status) {
            }).done((response) => {
                console.log("Message: " + response);
                showSnackbar("Image Deleted. Please submit Changes.")
            }).fail((error) => {
                console.log("Error: " + error.responseText);
                showSnackbar(error.responseText)
            });
        });
    }
}

function initUserProfileImage() {
    if ($('#user-profile-image').length) {
        var profile_image = new Dropzone('#user-profile-image', {
            autoProcessQueue: true,
            addRemoveLinks: true,
            url: '/media/uploadUserImage',
            paramName: 'agentImage',
            acceptedFiles: 'image/*',
            previewTemplate: document.querySelector('#dropzone-preview-template').innerHTML,
            parallelUploads: 2,
            thumbnailHeight: 120,
            thumbnailWidth: 120,
            maxFilesize: 3,
            maxFiles: 1,
            dictRemoveFile: `<svg viewBox="0 0 24 24">
                                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </svg>`,
            dictCancelUpload: `<svg viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z" />
                                </svg>`,
            filesizeBase: 1000,
            init: function () {
                let imageElement = $('#user-profile-image').parent().parent().find('input[name=image]');
                if (imageElement.length === 0 || $(imageElement).val() === "") {
                    return;
                }
                let image = $(imageElement).val();
                let file = {
                    processing: true,
                    accepted: true,
                    name: image,
                    size: 5000000,
                    type: 'image/jpeg',
                    status: Dropzone.SUCCESS
                }
                let thumbnailUrl = `/uploads/user/${$("input[name=userId]").val()}/${image}`
                this.files.push(file);
                this.emit("addedfile", file);
                this.emit("thumbnail", file, thumbnailUrl);
                this.emit("processing", file);
                this.emit("success", file, { status: "success" }, false);
                this.emit("complete", file);

            },
            thumbnail: function (file, dataUrl) {
                if (file.previewElement) {
                    file.previewElement.classList.remove("dz-file-preview");
                    var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                    for (var i = 0; i < images.length; i++) {
                        var thumbnailElement = images[i];
                        thumbnailElement.alt = file.name;
                        thumbnailElement.src = dataUrl;
                    }
                    setTimeout(function () { file.previewElement.classList.add("dz-image-preview"); }, 1);
                }
            }
        });

        profile_image.on('sending', function (file, xhr, formData) {
            formData.append('userId', $("#upload-user-id").val());
        });

        profile_image.on("complete", function (file) {
            if (file.status !== "success") {
                return;
            }
            $("#user-profile-image").parent().parent().find("input[name=image]").val("agentImage.jpg");
            showSnackbar("Image Uploaded. Please submit Changes.")
        });

        profile_image.on('removedfile', function (file) {
            if (file.status !== "success") {
                return;
            }
            $("#user-profile-image").parent().parent().find("input[name=image]").val("");
            let data = {
                userId: $("#upload-user-id").val(),
                imageName: file.name
            }
            $.post("/media/removeUserImage", data, function (result, status) {
            }).done((response) => {
                console.log("Message: " + response);
                showSnackbar("Image Deleted. Please submit Changes.")
            }).fail((error) => {
                console.log("Error: " + error.responseText);
                showSnackbar(error.responseText)
            });
        });
    }
}

if (typeof Dropzone !== "undefined") {
    Dropzone.autoDiscover = false;
    initDropzonePropertyImages();
    for (let i = 0; i < $('input[name=planName]').length; i++) {
        initDropzonePlanImage(i + 1);
    }
    initDropzoneBuilderImage();
    initUserProfileImage();
} 