$("#title").on('change', function(event) {
    if($(this).val().toLowerCase() === "other") {
        let otherRole = $(`<input type="text" class="otherRole" name="title" placeholder="Type role...">`);
        $("fieldset").first().append(otherRole);
    } else {
        $(".otherRole").remove();
    }
});

$("#name").focus();

const validateEmail = function (email) {
    const emailRegEx = /^\"?(\w+-?\.?\+?\w+)\"?@([\[\]\w\.-]+)$/gi;
    console.log(email);
    return emailRegEx.test(email);
};

const validateName = function (name) {
    const nameRegEx = /^[^\d_][A-Za-z]+ ?[A-Za-z]*$/gi;
    return nameRegEx.test(name);
};

$("#name").on("keyup", () => {
    if(validateName($("#name").val()))
        $(".invalidName").hide();
    else 
        $(".invalidName").show();
});

$("#mail").on("keyup", () => {
    if(validateEmail($("#mail").val()))
        $(".invalidEmail").hide();
    else 
        $(".invalidEmail").show();
});