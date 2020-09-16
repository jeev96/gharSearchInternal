jQuery(document).ready(function () {
    onLoad()
});

function onLoad() {
    myProperties = $("#my-properties").DataTable({
        "scrollX": true,
        "scrollY": false,
        sDom: 'lrtip',
        "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
    });
    $("#pagination-container").append($(".dataTables_paginate"));

    $("#my-properties-search").keyup(function () {
        myProperties.search($(this).val()).draw();
    })
}