var gitSearch = {
  gitbase: "https://api.github.com/",
  clientSecret: "3a2a9d8d907b7cfb609a912224c64753af02da3d",
  clientID: "43afa817ffad262576df",

  init: function() {
    gitSearch.getEntry();
  },

    getEntry: function() {
    $('#searchButton').click(function() {
      $('#repo_list ul').empty();
      var query = $('#textbox').val();
      if( query != "") {
        $('#error').hide();
        $('#warning').hide();
        $('#loader').show();        
        gitSearch.getuserInfo(query);        
        gitSearch.getRepos(query);
      }
      else {
        $('#loader, #image, #info, #repo_list').hide();
        $('#warning').show();
      }
    });
  },


  getuserInfo: function(username) {
      
    $.getJSON(gitSearch.gitbase + "users/" + username + "?client_id=" + gitSearch.clientID + "&client_secret=" + gitSearch.clientSecret, function(response) {
      $('#textbox').val("");
      var organization = gitSearch.getOrganisations(username);
      var avatar = response.avatar_url;
      var followers = response.followers;
      var following = response.following;
      var numOfRepos = response.public_repos;
      $('#loader').hide();
      $('#image').show();
      $('#info').show();
      $('#image').html("<img src=" + avatar + "/>");
      $('#info').html("<h3>Followers: " + followers + "<br><br>Following: " + following + "<br><br>Number of repositories: " + numOfRepos + "<br><br>Number of organisations: " + organization + "</h3>");
    }).fail(function(err) {
      if(err.status === 404) {
        $('#loader, #image, #info, #repo_list').hide();
        $('#error').html("<p>profile doesnt exist</p>").show();
        //alert("profile doesnt exist");
      }
      else if (err.status === 403) {
        //alert("Information cannot be accessed at the moment, try again later");
        $('#loader, #image, #info, #repo_list').hide();
        $('#error').html("<p>Information cannot be accessed at the moment, try again later</p>").show();
      }
      else {
        //alert("alert an error occured");
        $('#loader, #image, #info, #repo_list').hide();
        $('#error').html("<p>Could not process request, are you connected to the internet?</p>").show();
      }
    });
  },

  getRepos: function(user) {
    $.getJSON(gitSearch.gitbase + "users/" + user + "/repos?client_id=" + gitSearch.clientID + "&client_secret=" + gitSearch.clientSecret, function(data) {
      $.each(data, function(index,value) {
        var repolist = data[index].clone_url;
        var repoName = data[index].full_name;
        $('#repo_list').show();
        $('#repo_list ul').append("<li><a href=" + repolist + " target=blank>" + repoName + "</a></li><br>");
      });
    });
  },

  getOrganisations: function(userQuery) {
    var org_num = 0;
    $.getJSON(gitSearch.gitbase + "users/" + userQuery +" /orgs?client_id=" + gitSearch.clientID + "&client_secret=" + gitSearch.clientSecret, function(resp) {
    org_num = resp.length;     
    });
    return org_num;
  }
};

$(document).ready(gitSearch.init);

$(document).bind('keypress', function(e) {
    if(e.keyCode == 13){
         $('#searchButton').trigger('click');
     }
});