'use strict';

const {Clutter, GObject, St, GLib} = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

// TODO: 'imports.mainloop' is restricted from being used. Use GLib main loops and timeouts
const Mainloop = imports.mainloop;

const KubectxMenuButton = GObject.registerClass(
  class KubectxMenuButton extends PanelMenu.Button {
      _init() {
          super._init(0.0, 'Kubectx');

          this.box = new St.BoxLayout({
              y_expand: true,
              reactive: true,
          });

          this.topLabel = new St.Label({
              text: 'Kubectx ...',
              y_expand: true,
              y_align: Clutter.ActorAlign.CENTER,
          });

          this.add_actor(this.box);
          this.box.add_actor(this.topLabel);

          // force a first refresh
          this._refresh();

          // refresh loop
          this._timeout = Mainloop.timeout_add_seconds(5.0, this._refresh.bind(this));
      }

      _refresh() {
          //   log('kubectx-refresh');
          this.topLabel.set_text(this._getCurrentContext());
          return true;// force true for loop
      }

      _onDestroy() {
          this._removeTimeout();
          super._onDestroy();
      }

      _removeTimeout() {
          if (this._timeout) {
              Mainloop.source_remove(this._timeout);
              this._timeout = null;
          }
      }

      _getCurrentContext() {
          const cmd = 'kubectl config current-context';
          var [ok, out, err, exit] = GLib.spawn_command_line_sync(cmd);

          if (ok) {
          // parse output
              let outString = '';
              if (out instanceof Uint8Array)
                  outString = imports.byteArray.toString(out);
              else
                  outString = out.toString();

              // return fixed output string
              if (outString.length > 0)
                  return outString.replace('\n', '');
          }

          // default return
          return 'no kubectx';
      }

  });

let _kubeButton;

// eslint-disable-next-line no-unused-vars
function init() {
}

// eslint-disable-next-line no-unused-vars
function enable() {
    _kubeButton = new KubectxMenuButton();
    Main.panel.addToStatusArea('kubectx', _kubeButton);
}

// eslint-disable-next-line no-unused-vars
function disable() {
    _kubeButton.destroy();
}
