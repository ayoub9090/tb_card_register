var theData = [];

function goStep2() {
    let isCompleted = true;

    var fullname;
    var fullnameEnglish;;
    var Position;
    var PositionEnglish;
    var EmployeeNumber;

    $('form#step1Form [data-required="true"]').each(function () {
        if ($.trim($(this).val()) === "") {
            $(this).addClass('invalid');
            isCompleted = false;
        } else {
            $(this).removeClass('invalid');
        }
    })

    if (isCompleted) {
        var fullname = $('#FullName').val().split(" ").join("&nbsp;");
        var fullnameEnglish = $('#FullNameEnglish').val();
        var Position = $('#Position').val().split(" ").join("&nbsp;");
        var PositionEnglish = $('#PositionEnglish').val();
        var EmployeeNumber = $('#EmployeeNumber').val();

        theData.push({
            fullname: fullname,
            fullnameEnglish: fullnameEnglish,
            Position: Position,
            PositionEnglish: PositionEnglish,
            EmployeeNumber: EmployeeNumber
        });

        $('.step-1').addClass('hide');
        $('.step-2').removeClass('hide');
    }


    return false;
}

function goStep3() {
    if ($.trim($('#blah').attr('src')) !== '') {
        if (theData.length > 0) {
            $('.fullName').html(theData[0].fullname)
            $('.fullNameEnglish').html(theData[0].fullnameEnglish)
            $('.position').html(theData[0].Position)
            $('.positionEnglish').html(theData[0].PositionEnglish)
            $('.EmpNumber').html(fixNumbers(theData[0].EmployeeNumber))

        }
        $('.step-2').addClass('hide');
        $('.step-3').removeClass('hide');
    } else {
        alert("الرجاء رفع الصورة للمتابعه")
    }
}

function downloadPDF() {
    //var element = document.getElementById('finalCard');
    //html2pdf(element);

    var element = document.getElementById('finalCard');
    var opt = {
        filename: 'card-' + theData[0].EmployeeNumber + '.pdf',
        image: { type: 'png', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // New Promise-based usage:
    //html2pdf().set(opt).from(element).save();

    // Old monolithic-style usage:
    html2pdf(element, opt);


    $('.pdf-btn').addClass('btn-gray');
    $('.pdf-btn').attr('disabled', true);
    $('.loader').fadeIn();
    setTimeout(function () {
        $('.pdf-btn').removeClass('btn-gray');
        $('.pdf-btn').attr('disabled', false);
        $('.loader').fadeOut();
    }, 6000);
}

function goStep(index) {
    $('.step').addClass('hide');
    $('.step-' + index).removeClass('hide');
}

function readURL(input) {
    console.log(input)
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
            $('#imgInCard').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}

$("#imgUpload").change(function () {
    readURL(this);
});


function dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}


function dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                var type = file.type;
                if (type.indexOf('image') >= 0) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('#blah').attr('src', e.target.result);
                        $('#imgInCard').attr('src', e.target.result);
                    }
                    reader.readAsDataURL(file);

                } else {
                    alert('الرجاء التأكد من صيغة الصورة')
                }


                console.log('... file[' + i + '].name = ' + file.name);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    }
}

var
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
    fixNumbers = function (str) {
        if (typeof str === 'string') {
            for (var i = 0; i < 10; i++) {
                str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }
        return str;
    };

/*
Dropzone.options.dropzonePhoto = {
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 1, // MB
    acceptedFiles: 'image/*,application/pdf',
    accept: function (file, done) {
        if (file.name == "justinbieber.jpg") {
            done("Naha, you don't.");
        }
        else { done(); }
    }
};*/