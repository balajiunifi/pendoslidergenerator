$(document).ready(() => {
    $(".exporter").hide();
    $("#export").on("click", () => {
        let steps = [],
            promises = [];

       $(".step").each((i, ele) => {
           if ($(ele).find(".step-content").val()) {

               let promise = new Promise((resolve) => {
                   let image = $(ele).find(".step-image")[0].files;
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
                   steps[i] = {
                       header: $(ele).find(".step-header").val(),
                       image: image,
                       content: $(ele).find(".step-content").val(),
                       size: $(ele).find(".step-size").val()
                   };
               });

               promises.push(promise);
           }
       })

        Promise.all(promises)
            .then(() => {
                steps.forEach((d, j) => {
                    let step = $(".exporter-item:first-child")
                        .clone()
                        .show()
                        .prepend(`<h1>Step ${++j}</h1>`);

                    step.find(".html")
                        .val(`
                            <div class="step-container ${d.size}">
                                <div class="step-body">
                                    <div style="${d.image ? '' : 'display: none'}">
                                        <img src="${d.image || ''}">
                                    </div>
                                    <div class="step-body-header">
                                        ${d.header}
                                    </div>
                                    <p>
                                        ${d.content}
                                    </p>
                                </div>
                                <div class="step-footer clearfix">
                                    <div><button onclick="skip()" class="skip-btn">Skip</button></div>
                                    <div class="step-nav"></div>
                                    <div>
                                        <button onclick="next()" class="pull-right got-btn">Got it</button>
                                        <button class="pull-right next-btn" onclick="next()">Next</button>
                                    </div>
                                </div>
                            </div>
                          `);

                    $(".exporter").append(step);
                });
                $(".exporter").show();
                $(".form").hide();
            });
    });

    $(".reset").on("click", () => {
        window.location.reload();
    });

    $("#add-step").on("click", () => {
        let i = $(".step").length;

        $(".step-container").append(`
            <div class="step">
                <h2> Step ${ ++i }</h2>
                <div>header : <textarea class="step-header"></textarea></div>
                <div>image: <input class="step-image" type="file" /></div>
                <div>content: <textarea class="step-content"></textarea></div>
                <div>
                    size: <select name="size" class="step-size">
                            <option value="big">
                                big
                            </option>
                            <option value="small">
                                small
                            </option>
                            <option value="small-no-image">
                                small with no image
                            </option>
                        </select>
                </div>
                <div><button class="step-remove">remove</button></div>
            </div>
        `);
    });

    $(".step-container").on("click", (e) => {
       if ($(e.target).hasClass('step-remove')) {
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
