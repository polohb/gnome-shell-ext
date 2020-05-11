'use strict';

const {Clutter, GObject, St} = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const Soup = imports.gi.Soup;


function getIp(callback) {

    let _httpSession = new Soup.SessionAsync({ssl_use_system_ca_file: true});
    Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());
    let URL = 'https://api.ipify.org/';
    let request = Soup.Message.new('GET', URL);

    const _processRequest = (httpSession, message) => {
        if (message.status_code !== 200) {
            callback('error');
            return;
        }
        let response = request.response_body.data;
        callback(response);
    };
    _httpSession.queue_message(request, _processRequest);
}



const PublicIpButton  = GObject.registerClass(
  class PublicIpButton extends PanelMenu.Button {
      _init() {
          super._init(0.0, 'Public IP');

          this.box = new St.BoxLayout({
              y_expand: true,
              reactive: true,
          });

          this.topLabel = new St.Label({
              text: 'pub ip ...',
              y_expand: true,
              y_align: Clutter.ActorAlign.CENTER,
          });

          this.add_actor(this.box);
          this.box.add_actor(this.topLabel);

          // force a first refresh
          this._refresh();

      }

      setButtonText(outString) {
          if (outString.length > 0)
              this.topLabel.set_text(outString.replace('\n', ''));
          else
              this.topLabel.set_text('error2');

      }

      _refresh() {
          getIp(this.setButtonText.bind(this));
      }

      _onDestroy() {
          super._onDestroy();
      }

  });



let _publicIpButton;

// eslint-disable-next-line no-unused-vars
function init() {
}

// eslint-disable-next-line no-unused-vars
function enable() {
    _publicIpButton = new PublicIpButton();
    Main.panel.addToStatusArea('publicIp', _publicIpButton);
}

// eslint-disable-next-line no-unused-vars
function disable() {
    _publicIpButton.destroy();
}
