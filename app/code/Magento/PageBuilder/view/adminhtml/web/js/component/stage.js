/*eslint-disable */
define(["jquery", "mage/translate", "underscore", "./block/factory", "./config", "./data-store", "./event-bus", "./stage/event-handling-delegate", "./stage/save", "./stage/structural/editable-area"], function (_jquery, _translate, _underscore, _factory, _config, _dataStore, _eventBus, _eventHandlingDelegate, _save, _editableArea) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Stage =
  /*#__PURE__*/
  function (_EditableArea) {
    _inheritsLoose(Stage, _EditableArea);

    /**
     * Stage constructor
     *
     * @param parent
     * @param stageContent
     */
    function Stage(parent, stageContent) {
      var _this;

      _this = _EditableArea.call(this) || this;
      _this.active = true;
      _this.config = {
        name: "stage"
      };
      _this.loading = void 0;
      _this.originalScrollTop = void 0;
      _this.parent = void 0;
      _this.serializeRole = "stage";
      _this.showBorders = void 0;
      _this.stage = void 0;
      _this.store = void 0;
      _this.userSelect = void 0;
      _this.save = new _save();
      _this.saveRenderTree = _underscore.debounce(function () {
        _this.save.renderTree(_this.children).then(function (renderedOutput) {
          return _this.parent.value(renderedOutput);
        });
      }, 500);

      _this.setChildren(stageContent);

      _this.stage = _this;
      _this.parent = parent;
      _this.showBorders = parent.showBorders;
      _this.userSelect = parent.userSelect;
      _this.loading = parent.loading;
      _this.originalScrollTop = 0; // Create our state and store objects

      _this.store = new _dataStore(); // Any store state changes trigger a stage update event

      _this.store.subscribe(function () {
        return _eventBus.trigger("stage:updated", {
          stage: _this
        });
      }); // Handle events for this stage instance


      (0, _eventHandlingDelegate.handleEvents)(_this);
      /**
       * Watch for stage update events & manipulations to the store, debouce for 50ms as multiple stage changes
       * can occur concurrently.
       */

      _eventBus.on("stage:updated", function (event, params) {
        if (params.stage.id === _this.id) {
          _this.saveRenderTree.call(_this);
        }
      });

      return _this;
    }
    /**
     * Run the build system to initiate from existing structures
     *
     * @param {Build} buildInstance
     */


    var _proto = Stage.prototype;

    _proto.build = function build(buildInstance) {
      var _this2 = this;

      var self = this;

      if (buildInstance) {
        buildInstance.buildStage(this).then(self.ready.bind(self)).catch(function (error) {
          // Inform the user that an issue has occurred
          self.parent.alertDialog({
            content: (0, _translate)("An error has occurred while initiating the content area."),
            title: (0, _translate)("Advanced CMS Error")
          });

          _eventBus.trigger("stage:error", {
            stage: _this2,
            error: error
          });

          console.error(error);
        });
      } else {
        // Add an initial row to the stage if the stage is currently empty
        if (typeof _config.getInitConfig("contentTypes").row !== "undefined") {
          (0, _factory)(_config.getInitConfig("contentTypes").row, this, this, {}).then(function (row) {
            _this2.addChild(row);
          });
        }

        this.ready();
      }
    };
    /**
     * The stage has been initiated fully and is ready
     */


    _proto.ready = function ready() {
      _eventBus.trigger("stage:ready", {
        stage: this
      });

      this.children.valueHasMutated();
      this.loading(false);
    };
    /**
     * Set the dragging flat on the parent
     *
     * @param {boolean} flag
     */


    _proto.dragging = function dragging(flag) {
      this.parent.dragging(flag);
    };
    /**
     * Tells the stage wrapper to expand to fullscreen
     */


    _proto.goFullScreen = function goFullScreen() {
      var isFullScreen = this.parent.isFullScreen();

      if (!isFullScreen) {
        this.originalScrollTop = (0, _jquery)(window).scrollTop();

        _underscore.defer(function () {
          (0, _jquery)(window).scrollTop(0);
        });
      }

      this.stage.parent.isFullScreen(!isFullScreen);

      if (isFullScreen) {
        (0, _jquery)(window).scrollTop(this.originalScrollTop);
      }
    };
    /**
     * Determines if pagebuilder is in fullscreen mode
     *
     * @returns {boolean}
     */


    _proto.isFullScreen = function isFullScreen() {
      return this.parent.isFullScreen();
    };
    /**
     * Remove a child from the observable array
     *
     * @param child
     */


    _proto.removeChild = function removeChild(child) {
      if (this.children().length === 1) {
        this.parent.alertDialog({
          content: (0, _translate)("You are not able to remove the final row from the content."),
          title: (0, _translate)("Unable to Remove")
        });
        return;
      }

      _EditableArea.prototype.removeChild.call(this, child);
    };

    return Stage;
  }(_editableArea);

  return Stage;
});
//# sourceMappingURL=stage.js.map
