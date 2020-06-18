const Jscode = "window.noCarousel = __pendoSlideList.length == 1;\n" +
    "for (let i = 0; i < __pendoSlideList.length; i++) {\n" +
    "\tappend(\".slider-container\", \n" +
    "  `<div class='slider ${ i == 0 ? 'active': ''}'>\n" +
    "  \t\t<h3>${__pendoSlideList[i].header}</h3>\n" +
    "      ${\n" +
    "      __pendoSlideList[i].image ? `<div>\n" +
    "      \t<img src='${__pendoSlideList[i].image}'/>\n" +
    "      </div>` : ''\n" +
    "      }\n" +
    "      <p>${__pendoSlideList[i].content}</p>\n" +
    "   </div>`\n" +
    "  );\n" +
    "  if (!window.noCarousel) {\n" +
    "  \tappend(\".slider-nav-container\", `<span class=' ${ i == 0 ? 'active': ''}' data-index='${i}'></span>`);\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "get(\".slider-nav-container\")\n" +
    "\t.addEventListener(\"click\", (e) => {\n" +
    "    if (e.target.dataset.index !== undefined) {\n" +
    "      let index =\te.target.dataset.index;\n" +
    "      \n" +
    "      get(`.slider-nav-container span.active`).classList.remove(\"active\");\n" +
    "      e.target.classList.add(\"active\");\n" +
    "      \n" +
    "      get(\".slider.active\").classList.remove(\"active\");\n" +
    "      get(`.slider:nth-child(${Number(index) + 1})`).classList.add(\"active\");\n" +
    "    }\n" +
    "\n" +
    "  });\n" +
    "\n" +
    "function append(ele, html) {\n" +
    "\tele = get(ele);\n" +
    "\tele.innerHTML = ele.innerHTML + html;\n" +
    "}\n" +
    "\n" +
    "function get(ele) {\n" +
    "\treturn document.querySelector(ele);\n" +
    "}";

$(document).ready(() => {
    $(".exporter").hide();
    $("#export").on("click", () => {
        let slide = [],
            promises = [];

       $(".slide").each((i, ele) => {
           if ($(ele).find(".slide-content").val()) {

               let promise = new Promise((resolve) => {
                   let image = $(ele).find(".slide-image")[0].files;
                   if (image && image[0]) {
                       var reader = new FileReader();

                       reader.addEventListener("load", function(e) {
                           resolve(e.target.result);
                       });

                       reader.readAsDataURL(image[0]);
                   }
                   else {
                       resolve();
                   }
               });

               promise.then((image) => {
                   slide.push({
                       header: $(ele).find(".slide-header").val(),
                       image: image,
                       content: $(ele).find(".slide-content").val()
                   });
               });

               promises.push(promise);
           }

           Promise.all(promises)
               .then(() => {
                   let js = 'window.__pendoSlideList = ' + JSON.stringify(slide) + ';\n\n';

                   $(".js")
                       .val(js + Jscode);

                   $(".exporter").show();
                   $(".form").hide();

                   $('iframe')[0].src = 'data:text/html;charset=utf-8,' + escape (`
                    <head>
                        <style>
                            ${$('.css').val()}
                        </style>
                    </head>
                    <body>
                        ${$('.html').val()}
                        <script>
                            ${$('.js').val()}
                        </script>
                    </body>
               `);
               });
       })
    });

    $(".reset").on("click", () => {
        window.location.reload();
    });

    $("#add-slide").on("click", () => {
        $(".slide-container").append('<div class="slide">\n' +
            '                <div>header : <textarea class="slide-header"></textarea></div>\n' +
            '                <div>image: <input class="slide-image" type="file" /></div>\n' +
            '                <div>content: <textarea class="slide-content"></textarea></div>\n' +
            '                <div><button class="slide-remove">remove</button></div>' +
            '            </div>');
    });

    $(".slide-container").on("click", (e) => {
       if ($(e.target).hasClass('slide-remove')) {
           $(e.target).parent().parent().remove();
       }
    });

    $(".exporter textarea").on('click', function () {
        copyToClipboard(this);
    })
});

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).val()).select();
    document.execCommand("copy");
    $temp.remove();
}
