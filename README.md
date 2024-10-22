# jspsych-distribution-builder
A minimal implementation of the distribution builder plugin for JsPsych with example

Code can be downloaded [here](https://github.com/julianquandt/jspsych-distribution-builder/archive/refs/heads/main.zip). 

Once downloaded, you have multiple options to run the experiment:

1. Locally (for development and testing only).
   a) Windows: Use an app such as [xammp](https://www.apachefriends.org/) to create a lamp server. Open the application and click the "start" button next to apache. Then click on "Explorer". Unzip the folder you downloaded here and copy it into the htdocs folder in xampp. Once you have copied it, you can access your app by entering localhost/jsPsych-distribution-builder in your web browser.
   b) Mac should work exactly as windows but I dont have macOS so I cannot test it.
   c) Linux: If you use linux I assume you know how to set up an apache2 server and copy the app.

2. Online (for actual running of the experiment)
  a) Use pavlovia (recommended). Create a free [Pavlovia](https://pavlovia.org/) account. Go on Create project, 
  b) Use heroku (more difficult setup and costs money); instructions can be found [here](https://github.com/Tuuleh/jsPsychBackendStart), advantage is that it can also take care of the data backend (which costs even more money).
  c) Use a personal webserver (most complicated setup if you don't have one / know how to already). 
