const API_KEY = "324e5aaa";
$(document).ready(function () {
  $("form").submit((e) => {
    e.preventDefault();
    const title = $("#title-input").val();
    if (!title) return;

    const type = $("#type").val();
    const year = $("#year").val();
    const url = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${title}&type=${type}${
      !year ? "" : "&y=" + year
    }`;
    apiCALL(url);
  });
});

function apiCALL(url) {
  $.ajax({
    type: "GET",
    url: url,
    success: (response) => {
      let response_json = JSON.parse(response);
      console.log(response_json);
    },
  });
}
