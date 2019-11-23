$(document).ready(function () {

    // Focus on name input field
    $("#name").focus();

    // Hide other job role input box
    $("#other-title").hide();

    // Hide color until something other than select theme option is selected
    $("#colors-js-puns").hide();

    selectPaymentOption();

    $("#name").on('keyup', validateUserName);
    $("#mail").on('keyup', validateEmail);
    $("#cc-num").on('keyup', validateCreditCardNumber);
    $("#zip").on('keyup', validateZip);
    $("#cvv").on('keyup', validateCVV);
    // On change of title for job role if other selected show input to add job role
    $("#title").on('change', function (event) {
        if ($(this).val().toLowerCase() === "other") {
            $("#other-title").show();
        } else {
            $("#other-title").hide();
        }
    });

    // Look for changes in t-shirt design
    $("#design").on('change', function (event) {
        const relaventOptionToSearch = $(this).val().replace('heart', '♥');

        if ($(this).val().toLowerCase() != "") {
            $("#colors-js-puns").show();
        } else {
            $("#colors-js-puns").hide();
        }

        // Based on the value of the t-shirt design loop through all the t-shirt color
        // options and check for existance of t-shirt design value in the that element

        let flagToSetValue = false;

        $("#color").find("option").each((index, element) => {
            if (!$(element).html().toLowerCase().includes(relaventOptionToSearch)) {
                $(element).hide();
            } else {
                if (!flagToSetValue) {
                    flagToSetValue = true;
                    $("#color").val($(element).attr('value'));
                }
                $(element).show();
            }
        });
    });

    // cost for activities to register
    let costOfActivities = 0;

    $(".activities").on("change", "input[type=checkbox]", function (event) {
        validateActivities();
        // Finding total-cost
        if ($(this).is(":checked")) {
            costOfActivities += $(this).data("cost");
        } else {
            costOfActivities -= $(this).data("cost");
        }
        $(".totalCost").text(`Total: $${costOfActivities}`);

        let checkedActivities = $(".activities").find("input[type=checkbox]").filter((index, inputElement) => {
            return $(inputElement).is(":checked");
        });

        let selectedDaysAndTimes = checkedActivities.map((index, checkedActivity) => {
            return $(checkedActivity).data("day-and-time");
        });

        setValidActivies(selectedDaysAndTimes);
        $(this).removeAttr("disabled");
    });

    // Disable activities which cannot be done within selected activities
    function setValidActivies(selectedDaysAndTimes) {
        $(".activities").find("input[type=checkbox]").each((index, inputElement) => {
            if (!$(inputElement).is(":checked")) {
                let activityDayAndTime = getDayAndTimeObject($(inputElement).data("day-and-time"));
                if (activityDayAndTime != null) {
                    let isTimingCollapsing = false;
                    for (let selectedDayAndTime of selectedDaysAndTimes) {
                        selectedDayAndTime = getDayAndTimeObject(selectedDayAndTime);
                        isTimingCollapsing = isTimingCollapsing ||
                            ((activityDayAndTime.day === selectedDayAndTime.day &&
                                (activityDayAndTime.startTime >= selectedDayAndTime.startTime &&
                                    activityDayAndTime.startTime <= selectedDayAndTime.endTime) &&
                                (activityDayAndTime.endTime >= selectedDayAndTime.startTime &&
                                    activityDayAndTime.endTime <= selectedDayAndTime.endTime)));
                    }
                    if (isTimingCollapsing) {
                        $(inputElement).attr("disabled", true);
                        $(inputElement).parent().addClass("strike-through");
                    } else {
                        $(inputElement).removeAttr("disabled");
                        $(inputElement).parent().removeClass("strike-through");
                    }
                }
            }
        });
    }

    // Return day and time in specific format by taking input as string 
    // e.g. For input "Tuesday 12pm-3pm", function returns 
    // { day: "Tuesday", startTime: 12, endTime: 15 }
    function getDayAndTimeObject(dayAndTime) {
        if (dayAndTime) {
            const regExForDayAndTime = /(\w+)\s(\d{1,2}\w{2})-(\d{1,2}\w{2})/;
            let day = dayAndTime.replace(regExForDayAndTime, "$1");
            let startTime = formatTime(dayAndTime.replace(regExForDayAndTime, "$2"));
            let endTime = formatTime(dayAndTime.replace(regExForDayAndTime, "$3"));
            return { day, startTime, endTime };
        }
        return null;
    }

    // Format time in 24hrs format e.g. For 1pm => 13 
    function formatTime(time) {
        const regExForTime = /(\d{1,2})[ap]m/;
        let formatedTime = parseInt(time.replace(regExForTime, "$1"));
        if (time.endsWith("pm")) {
            if (formatedTime != 12)
                formatedTime += 12;
        } else {
            if (formatedTime == 12)
                formatedTime = 0;
        }
        return formatedTime;
    }

    // On payment option change show appropriate content
    $("#payment").on("change", function (event) {
        selectPaymentOption();
    });

    // Will show appropriate payment content on selecting particular payment option
    function selectPaymentOption() {
        let selectedPaymentOption = $("#payment").val().replace(" ", "-");
        $("#credit-card").find("span.error-message").remove();
        $("#credit-card").find(".error").removeClass("error");
        if (selectedPaymentOption === "select-method")
            selectedPaymentOption = "credit-card";
        $("#payment").closest("fieldset").children("div").each((index, divElement) => {
            if ($(divElement).attr("id") != selectedPaymentOption) {
                $(divElement).hide();
            } else {
                $(divElement).show();
            }
        });
    }

    // Validate form after submitting form
    $("form").on("submit", function (event) {
        event.preventDefault();
        validateUserName();
        validateEmail();
        validateActivities();
        if ($("#payment").val() === "credit card"
            || $("#payment").val() === "select method") {
            validateCreditCardNumber();
            validateZip();
            validateCVV();
        }
    });

    // Validate User name
    function validateUserName() {
        const name = $("#name").val().trim();
        if (name.length > 0) {
            $("#name").removeClass("error");
            $("label[for=name]").find(".error-message").remove();
        } else {
            if (!$("#name").hasClass("error")) {
                $("#name").addClass("error");
                const errorMessage = $("<span class='error-message'>[Please enter your name]</span>");
                $("label[for=name]").append(errorMessage);
            }
        }
    }

    // Validate email address
    function validateEmail() {
        const mail = $("#mail").val().trim();
        const mailRegEx = /^[^@]+@[^@.]+\.[a-z]+$/i;
        if (mailRegEx.test(mail)) {
            $("#mail").removeClass("error");
            $("label[for=mail]").find(".error-message").remove();
        } else {
            const error = (mail.length === 0)
                ? "Please enter email address"
                : "Please enter valid email address";
            if (!$("#mail").hasClass("error")) {
                const errorMessage = $("<span class='error-message'></span>");
                $("label[for=mail]").append(errorMessage);
                $("#mail").addClass("error");
            }
            $("label[for=mail]").find(".error-message").text(`[${error}]`);
        }
    }

    // validate activities
    function validateActivities() {
        if ($(".activities").find("input[type=checkbox]:checked").length === 0) {
            if (!$(".activities > legend").hasClass("error-message")) {
                $(".activities > legend").addClass("error-message");
                const errorMessage = $("<span class='error-message'>[Select at least one activity]</span>");
                $(".activities > legend").append(errorMessage);
            }
        }
        else {
            $(".activities > legend").removeClass("error-message");
            $(".activities > legend").find(".error-message").remove();
        }
    }

    // validate credit card number
    function validateCreditCardNumber() {
        const creditCardNumber = $("#cc-num").val().trim();
        let creditCardNumberRegEx = /^(\d){13,16}$/;
        if (creditCardNumberRegEx.test(creditCardNumber)) {
            $("label[for=cc-num]").find(".error-message").remove();
            $("#cc-num").removeClass("error");
        } else {
            const error = (creditCardNumber.length === 0)
                ? "Please enter a credit card number"
                : "Please enter a number that is between 13 and 16 digits long";
            if (!$("#cc-num").hasClass("error")) {
                const errorMessage = $("<span class='error-message'></span>");
                $("label[for=cc-num]").append(errorMessage);
                $("#cc-num").addClass("error");
            }
            $("label[for=cc-num]").find(".error-message").text(`[${error}]`);
        }
    }

    // validate zip
    function validateZip() {
        const zip = $("#zip").val().trim();
        let zipRegEx = /^(\d){5}$/;
        if (zipRegEx.test(zip)) {
            $("label[for=zip]").find(".error-message").remove();
            $("#zip").removeClass("error");
        } else {
            const error = (zip.length === 0)
                ? "Please enter zip"
                : "Please enter a number that is having length 5";
            if (!$("#zip").hasClass("error")) {
                const errorMessage = $("<span class='error-message'></span>");
                $("label[for=zip]").append(errorMessage);
                $("#zip").addClass("error");
            }
            $("label[for=zip]").find(".error-message").text(`[${error}]`);
        }
    }

    // validate cvv
    function validateCVV() {
        const cvv = $("#cvv").val().trim();
        let cvvRegEx = /^(\d){3}$/;
        if (cvvRegEx.test(cvv)) {
            $("label[for=cvv]").find(".error-message").remove();
            $("#cvv").removeClass("error");
        } else {
            const error = (cvv.length === 0)
                ? "Please enter cvv"
                : "Please enter a number that is having length 3";
            if (!$("#cvv").hasClass("error")) {
                const errorMessage = $("<span class='error-message'></span>");
                $("label[for=cvv]").append(errorMessage);
                $("#cvv").addClass("error");
            }
            $("label[for=cvv]").find(".error-message").text(`[${error}]`);
        }
    }
});