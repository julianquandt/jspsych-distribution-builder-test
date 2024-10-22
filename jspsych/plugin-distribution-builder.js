// Import jsPsych (assuming modern jsPsych module format)
var jsPsychDistributionBuilder = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-distribution-builder",
    version: "1.0.0",
    description: "jsPsych plugin for creating a distribution using visual elements",
    type: "module",
    main: "dist/index.cjs",
    exports: {
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    },
    typings: "dist/index.d.ts",
    unpkg: "dist/index.browser.min.js",
    files: [
      "src",
      "dist"
    ]
  };

  const info = {
    name: "distribution-builder",
    version: _package.version,
    description: "A plugin for creating a distribution using visual elements",
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      min: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      blocks: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Number of Blocks',
        default: 5,
        description: 'Sets the number of rating blocks / points on likert scale',
      },
      labels: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      points: {
        type: jspsych.ParameterType.INT,
        pretty_name:'Number of Points',
        default: 1,
        description: 'Sets the number of points to distribute',
      },
      scale_width: {
        type: jspsych.ParameterType.INT,
        pretty_name:'Scale width',
        default: null,
        description: 'Width of the scale in pixels.'
      },
      scale_height: {
        type: jspsych.ParameterType.INT,
        pretty_name:'Scale height',
        default: null,
        description: 'height of the scale in pixels.'
      },
      max_scale_height: {
        type: jspsych.ParameterType.INT,
        pretty_name:'Max Scale height',
        default: 500,
        description: 'max height of the scale in pixels.'
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      require_all: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Require all points to be distributed',
        default: false,
        description: 'If true, the participant will have distribute all points before continuing.'
      },
      prompt: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the slider.'
      },
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      value_map: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name:'Value map',
        default: [],
        array: true,
        description: 'map of values to boxes.',
      },
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
      show_bubble: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Show value bubble',
        default: true,
        description: 'If true, a bubble will be shown representing the value .'
      },
      sort_columns: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Sort column points',
        default: true,
        description: 'Sets whether the columns should be sorted or not (disabling useful for 2x2 rating scales).'
      }
    }
  };

  class DistributionBuilderPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var html =
      '<div id="jspsych-distribution-builder-response-stimulus">' +
      trial.stimulus +
      '</div>';
    html +=
      '<div id="jspsych-distribution-builder-response-wrapper" style="margin: 20px 0px;">';
    html +=
      '<div class="jspsych-distribution-builder-response-container" style="position:relative; margin: 0 auto 3em auto; ';
    
    if (trial.scale_width !== null) {
      html += 'width:' + trial.scale_width + 'px;';
    } else {
      html += 'width:' + 1000 + 'px;';
    }
    
    if (trial.scale_height !== null) {
      var grid_height = trial.scale_height;
      html += 'height:' + trial.scale_height + 'px;';
    } else {
      var grid_height = Math.floor(trial.scale_width / trial.blocks) * trial.points;
      if (grid_height > trial.max_scale_height) {
        grid_height = trial.max_scale_height;
      }
      html += 'height:' + grid_height + 'px;';
    }
    html += '">';
    
    html +=
      '<div class="range-value" id="rangeV" style="position: absolute"></div>';
    
    html += '<div class="grid-container"';
    // Apply grid-template-columns based on trial.blocks
    var col_number_css = '';
    for (i = 0; i < trial.blocks; i++) {
      col_number_css = col_number_css.concat(' auto');
    }
    col_number_css = col_number_css.concat(';');
    html += ' style="grid-template-columns:' + col_number_css + ';">';
    html += '</div>';
    
    // Labels container
    html +=
      '<div class="grid-container" style="justify-content: space-between; background-color: #ffffff; height: 18px;';
    var label_number_css = '';
    for (i = 0; i < trial.labels.length; i++) {
      label_number_css = label_number_css.concat(' auto');
    }
    label_number_css = label_number_css.concat(';');
    html += 'grid-template-columns:' + label_number_css + ';">';
    
    for (var j = 0; j < trial.labels.length; j++) {
      var tmp_label_name = 'label' + j.toString();
      html += '<div id="' + tmp_label_name + '" style="display: inline-block;">';
      html +=
        '<span style="text-align: center; font-size: 120%;">' +
        trial.labels[j] +
        '</span>';
      html += '</div>';
    }
    html += '</div>'; // Close grid-container for labels
    
    // Start zone with draggable items
    html += '<div class="container">'; // Add container for layout control
    html += '<div class="startzone" style="left:' + trial.scale_width / 2 + 'px;">';
    
    for (var j = 0; j < trial.points; j++) {
      var tmp_name = 'point_' + j.toString();
      html += '<div class="item" id="' + tmp_name + '" draggable="true"></div>';
    }
    html += '</div>'; // Close startzone
    
    // Add prompt if available
    if (trial.prompt !== null) {
      html += '<div class="prompt">' + trial.prompt + '</div>'; // Wrap in prompt div
    }
    
    // Add submit button
    html +=
      '<button id="jspsych-distribution-builder-response-next" class="jspsych-btn">' +
      trial.button_label +
      '</button>';
    
    html += '</div>'; // Close container
    html += '</div>'; // Close jspsych-distribution-builder-response-container
    html += '</div>'; // Close jspsych-distribution-builder-response-wrapper
    

    display_element.innerHTML = html;

    // Ensure the content container height includes the button
    var wrapper = document.querySelector('.jspsych-content-wrapper');
    var button = document.querySelector('#jspsych-distribution-builder-response-next');
    if (wrapper && button) {
      wrapper.style.paddingBottom = button.offsetHeight + 30 + 'px'; // Adjust padding to account for button height
    }

    function median (values) {
      if (values.length === 0) return 0;

      values.sort (function (a, b) {
        return a - b;
      });

      var half = Math.floor (values.length / 2);

      if (values.length % 2) return values[half];

      return (values[half - 1] + values[half]) / 2.0;
    }

    var response = {
      rt: null,
      response: null,
    };

    const avg = arr => {
      const sum = arr.reduce ((acc, cur) => acc + cur);
      const average = sum / arr.length;
      return average;
    };

    function sd (values) {
      var avg = average (values);

      var squareDiffs = values.map (function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });

      var avgSquareDiff = average (squareDiffs);

      var stdDev = Math.sqrt (avgSquareDiff);
      return stdDev;
    }

    function average (data) {
      var sum = data.reduce (function (sum, value) {
        return sum + value;
      }, 0);

      var avg = sum / data.length;
      return avg;
    }

    function sortBoxes (boxes = boxes, draggable = draggable) {
      console.log('sorting boxes');
      var orig_col_boxes_full = [];
      var orig_col_boxes_empty = [];
      boxes.forEach (box => {
        if (
          box.id.split ('_')[1] == draggable.parentElement.id.split ('_')[1]
        ) {
          if (
            (box.childElementCount == 0) |
            (box.id == draggable.parentElement.id)
          ) {
            // get boxes from origin location
            orig_col_boxes_empty.push (box.id);
          } else {
            if (box.id != draggable.parentElement.id) {
              orig_col_boxes_full.push (box.id);
            }
          }
        }
      });

      if (orig_col_boxes_full.length > 0) {
        orig_col_boxes_empty = orig_col_boxes_empty.sort (
          (a, b) => Number (a.replace ('_', '')) - Number (b.replace ('_', ''))
        );
        orig_col_boxes_full = orig_col_boxes_full.sort (
          (a, b) => Number (a.replace ('_', '')) - Number (b.replace ('_', ''))
        );
        if (
          Number (orig_col_boxes_empty[0].replace ('_', '')) <
          Number (
            orig_col_boxes_full[orig_col_boxes_full.length - 1].replace (
              '_',
              ''
            )
          )
        ) {
          var switch_origin = document.getElementById (
            orig_col_boxes_full[orig_col_boxes_full.length - 1]
          );
          var point_to_switch = switch_origin.childNodes[0];
          var switch_target = document.getElementById (orig_col_boxes_empty[0]);
          switch_target.appendChild (point_to_switch);
          switch_origin.style.opacity = 0.5;
          switch_origin.style.borderColor = '#2196F3';
          switch_origin.style.backgroundColor = '#ccc';
          switch_target.style.opacity = 1.0;
          switch_target.style.backgroundColor = '#F0DB4F';
          switch_target.style.borderColor = '#F0DB4F';
        }
      }
    }
    /* draggable element */
    var items = display_element.querySelectorAll ('.item');
    items.forEach (item => {
      item.addEventListener ('dragstart', dragStart);
      if (trial.points > 1) {
        // add no-after class to items to make sure dragging works correctly in multiple-bid case
        item.classList.add ('no-after');
      }
    });

    var startzone = display_element.querySelector ('.startzone');

    var hw = document.createElement ('div');
    hw.classList.add ('box');
    var total_blocks = trial.blocks * trial.points;
    for (var j = 0; j < total_blocks; j++) {
      var tmp_name =
        (trial.points - 1 - Math.floor (j / trial.blocks)).toString () +
        '_' +
        (j % trial.blocks).toString ();
      hw.id = tmp_name;

      if (j == 0) {
        var height = Math.floor (grid_height / trial.points) - 7;
        var set_height = height + 'px';

        var width = Math.floor (trial.scale_width / trial.blocks) - 6;
        var set_width = width + 'px';

        var startzone_style =
          startzone.currentStyle || window.getComputedStyle (startzone);

        var rr = document.getElementById (
          'jspsych-distribution-builder-response-wrapper'
        );

        var rr_style = rr.currentStyle || window.getComputedStyle (rr);
        var rr_bottom_margin = parseInt (rr_style.marginBottom);
      }

      if (height < width) {
        hw.style.height = set_height;
        hw.style.width = set_width;

        if (j == 0) {
          var startzone_size = height + 10;
          var set_startzone_size = startzone_size + 'px';
          startzone.style.height = set_startzone_size;
          startzone.style.width = set_startzone_size;
          var startzone_left = parseInt (startzone_style.left);
          startzone_left = startzone_left - startzone_size / 2 + 'px';
          startzone.style.left = startzone_left;

          var rr_set_bottom_margin =
            rr_bottom_margin + startzone_size / 2 + 'px';
          rr.style.marginBottom = rr_set_bottom_margin;

          items.forEach (item => {
            item.style.height = height + 6 + 'px';
            item.style.width = width + 6 + 'px';
          });
        }
      } else {
        hw.style.width = set_width;
        hw.style.height = set_width;

        if (j == 0) {
          var startzone_size = width + 10;
          var set_startzone_size = startzone_size + 'px';
          startzone.style.height = set_startzone_size;
          startzone.style.width = set_startzone_size;
          var startzone_left = parseInt (startzone_style.left);
          startzone_left = startzone_left - startzone_size / 2 + 'px';
          startzone.style.left = startzone_left;

          var rr_set_bottom_margin =
            rr_bottom_margin + startzone_size / 2 + 'px';
          rr.style.marginBottom = rr_set_bottom_margin;

          items.forEach (item => {
            item.style.height = width + 6 + 'px';
            item.style.width = width + 6 + 'px';
          });
        }
      }

      var target_container = display_element.querySelector ('.grid-container');
      
      if(hw.id.split('_')[0] == 0){
        target_container.appendChild (hw.cloneNode (true));
      } else {
        // append but make invisible
        var hw_clone = hw.cloneNode (true);
        hw_clone.style.visibility = 'hidden';
        target_container.appendChild (hw_clone);
      }
    }

    function unhide_boxes (boxes = boxes, draggable = draggable, target = smallest_box) {

      var orig_col_boxes_full = [];
      var orig_col_boxes_empty = [];
      var max_pc = 0;
      boxes.forEach (box => {
          if (
            (box.childElementCount == 0) |
            (box.id == draggable.parentElement.id)
          ) {
            // get boxes from origin location
            orig_col_boxes_empty.push (box);
          } else {
            orig_col_boxes_full.push (box);
          }
      });
      orig_col_boxes_full.push(target);
      // for all full boxes, get their row id (box.id.split('_')[0]) and find the max
      console.log(orig_col_boxes_empty);
      console.log(orig_col_boxes_full);
      if (orig_col_boxes_full.length > 0) {
        console.log("non empty boxes");
        orig_col_boxes_full.forEach (box => {
          if (box.id.split ('_')[0] > max_pc) {
            max_pc = Number(box.id.split ('_')[0]);
          }
        });
      }
      console.log(max_pc);
      boxes.forEach (box => {
        if (box.id.split ('_')[0] <= max_pc+1) {
          box.style.visibility = 'visible';
        } else {
          box.style.visibility = 'hidden';
        }
      });
    }

    function dragStart (e) {
      e.dataTransfer.setData ('text/plain', e.target.id);
      setTimeout (() => {
        if (e.target.parentElement.classList.contains ('box')) {
          e.target.parentElement.style.opacity = 0.5;
          e.target.parentElement.style.backgroundColor = '#ccc';
          e.target.parentElement.style.borderColor = '#2196F3';
        }
        e.target.classList.add ('hide');
      }, 0);
    }

    /* drop targets */
    var boxes = display_element.querySelectorAll ('.box');
    boxes.forEach (box => {
      box.addEventListener ('dragenter', dragEnter);
      // box.addEventListener('dragover', dragOver); // not necessary because it is defined for body
      box.addEventListener ('dragleave', dragLeave);
      // box.addEventListener('drop', drop); // not necessary because it is defined for body
      if (trial.points > 1) {
        box.classList.add ('no-after');
      }
    });
    startzone.addEventListener ('dragenter', dragEnter);
    startzone.addEventListener ('dragover', dragOver);
    startzone.addEventListener ('dragleave', dragLeave);
    startzone.addEventListener ('drop', drop);
    document.body.addEventListener ('drop', drop);
    document.body.addEventListener ('dragover', dragOver);
    display_element
      .querySelector ('#jspsych-distribution-builder-response-next')
      .addEventListener ('drop', drop);
    display_element
      .querySelector ('#jspsych-distribution-builder-response-next')
      .addEventListener ('dragover', dragOver);

    function dragEnter (e) {
      e.preventDefault ();
      if (e.target.classList.contains ('box')) {
        rangeV.style.visibility = 'visible';
        e.target.classList.add ('drag-over-valid');
      } else {
        e.target.classList.add ('drag-over-invalid');
      }
    }

    function dragOver (e) {
      e.preventDefault ();
      if (e.target.classList.contains ('box')) {
        e.target.classList.add ('drag-over-valid');

        // show bubble with value over scale
        if (trial.show_bubble) {
          rangeV = display_element.querySelector ('#rangeV');
          var cur_pos_rel = Number (e.target.id.split ('_')[1]);
          if (trial.value_map.length > 0) {
            rangeV.innerHTML = `<span>${trial.value_map[cur_pos_rel]}</span>`;
          } else {
            rangeV.innerHTML = `<span>${cur_pos_rel}</span>`;
          }

          var cur_pos =
            trial.scale_width +
            (width + 7) / 2 -
            ((trial.blocks - cur_pos_rel) * (width + 7) +
              (trial.blocks - 1 - cur_pos_rel) *
                ((trial.scale_width - trial.blocks * (width + 7)) /
                  (trial.blocks - 1)));
          rangeV.style.left = Math.floor (cur_pos) + 'px';
        }
      } else {
        e.target.classList.add ('drag-over-invalid');
      }
    }

    function dragLeave (e) {
      if (e.target.classList.contains ('box')) {
        e.target.classList.remove ('drag-over-valid');
      } else {
        e.target.classList.remove ('drag-over-invalid');
      }
    }

    function drop (e) {
      rangeV.style.visibility = 'hidden';

      e.preventDefault ();
      // get the draggable element
      var id = e.dataTransfer.getData ('text/plain');
      var draggable = document.getElementById (id);

      // add it to the drop target
      if (e.target.classList.contains ('box')) {
        if (e.target.childElementCount == 0) {
          if (trial.sort_columns) {
            if (!draggable.parentElement.classList.contains ('startzone')) {
              if (
                e.target.id.split ('_')[1] ==
                draggable.parentElement.id.split ('_')[1]
              ) {
                // get boxes from traget location
                var col_boxes_empty = [draggable.parentElement.id];
              } else {
                sortBoxes (boxes, draggable);
                var col_boxes_empty = [];
              }
            } else {
              var col_boxes_empty = [];
            }

            boxes.forEach (box => {
              if (
                (box.id.split ('_')[1] == e.target.id.split ('_')[1]) &
                (box.childElementCount == 0)
              ) {
                col_boxes_empty.push (box.id);
              }
            });

            col_boxes_empty = col_boxes_empty.sort (
              (a, b) =>
                Number (a.replace ('_', '')) - Number (b.replace ('_', ''))
            );
            var smallest_box = document.getElementById (col_boxes_empty[0]);
          } else {
            var smallest_box = e.target;
          }

          smallest_box.appendChild (draggable);
          smallest_box.style.opacity = 1.0;
          smallest_box.style.backgroundColor = '#F0DB4F';
          smallest_box.style.borderColor = '#F0DB4F';
          e.target.classList.remove ('drag-over-valid');
          unhide_boxes (boxes, draggable, smallest_box);
        } else {
          e.target.classList.remove ('drag-over-valid');
          if (e.target.id == draggable.parentElement.id) {
            e.target.appendChild (draggable);
            e.target.style.opacity = 1.0;
            e.target.style.backgroundColor = '#F0DB4F';
            e.target.style.borderColor = '#F0DB4F';
          } else {
            startzone.appendChild (document.getElementById (id));
          }
        }
      } else {
        if (trial.sort_columns) {
          sortBoxes (boxes, draggable);
        }
        if (trial.require_all) {
        }
        e.target.classList.remove ('drag-over-invalid');
        startzone.appendChild (document.getElementById (id));
      }

      // display the draggable element
      draggable.classList.remove ('hide');
    }

    display_element
      .querySelector ('#jspsych-distribution-builder-response-next')
      .addEventListener ('click', function () {
        // measure response time
        if (trial.require_all) {
          if (startzone.childElementCount > 0) {
            alert ('Please distribute all points');
            // this fixes problem when point is dragged out of the window entirely
            startzone.childNodes.forEach (node => {
              if (node.classList.contains ('hide')) {
                node.classList.remove ('hide'); // make point visible again if it is dragged out of the window and no drop is triggered
              }
            });
          } else {
            var endTime = performance.now ();
            response.rt = endTime - startTime;
            var response_boxes = [];
            boxes.forEach (box => {
              if (box.childElementCount > 0) {
                response_boxes.push (box.id);
              }
            });
            response.response = response_boxes.join ('a');
            if (trial.response_ends_trial) {
              end_trial ();
            } else {
              display_element.querySelector (
                '#jspsych-distribution-builder-response-next'
              ).disabled = true;
            }
          }
        } else {
          var endTime = performance.now ();
          response.rt = endTime - startTime;
          var response_boxes = [];
          boxes.forEach (box => {
            if (box.childElementCount > 0) {
              response_boxes.push (box.id);
            }
          });
          response.response = response_boxes.join ('a');
          if (trial.response_ends_trial) {
            end_trial ();
          } else {
            display_element.querySelector (
              '#jspsych-distribution-builder-response-next'
            ).disabled = true;
          }
        }
      });

    function end_trial () {
      jsPsych.pluginAPI.clearAllTimeouts ();

      // save data
      var all_responses = [];
      for (i = 0; i < trial.points; i++) {
        var tmp_res = response.response.split ('a')[i];
        all_responses[i] = Number (tmp_res.split ('_')[1]);
      }
      var response_mean = avg (all_responses);
      var response_median = median (all_responses);
      var response_sd = sd (all_responses);
      var response_range =
        Math.max (...all_responses) - Math.min (...all_responses);

      var trialdata = {
        rt: response.rt,
        response: response.response,
        stimulus: trial.stimulus,
        response_mean: response_mean,
        response_median: response_median,
        response_sd: response_sd,
        response_range: response_range,
      };
      console.log (trialdata);
      // remove event listeners, otherwise they will add up for each trial
      document.body.removeEventListener ('drop', drop);
      document.body.removeEventListener ('dragover', dragOver);
      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial (trialdata);
    }

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout (function () {
        display_element.querySelector (
          '#jspsych-distribution-builder-response-stimulus'
        ).style.visibility =
          'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout (function () {
        end_trial ();
      }, trial.trial_duration);
    }

    var startTime = performance.now ();
    }
  }

  return DistributionBuilderPlugin;
})(jsPsychModule);