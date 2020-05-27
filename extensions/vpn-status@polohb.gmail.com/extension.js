'use strict';

const {Clutter, GObject, St, GLib} = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

// TODO: 'imports.mainloop' is restricted from being used. Use GLib main loops and timeouts
const Mainloop = imports.mainloop;


const VpnStatusMenuButton = GObject.registerClass(
class VpnStatusMenuButton extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'VpnStatus');

        this.box = new St.BoxLayout({
            y_expand: true,
            reactive: true,
        });

        this.topLabel = new St.Label({
            text: 'VPN ...',
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER,
        });

        this.add_actor(this.box);
        this.box.add_actor(this.topLabel);

        // force first refresh
        this._refresh();

        // refresh loop
        this._timeout = Mainloop.timeout_add_seconds(5.0, this._refresh.bind(this));

        this._buildSubMenu();
    }



    _buildSubMenu() {
        var existProgram = GLib.find_program_in_path('wg-quick');
        if (existProgram !== null) {
            // standard menu items
            let menuitem = new PopupMenu.PopupMenuItem('up wg0');
            let menuitem2 = new PopupMenu.PopupMenuItem('down wg0');
            // adding sub menu items
            this.menu.addMenuItem(menuitem);
            this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
            this.menu.addMenuItem(menuitem2);

            menuitem.connect('activate', () => {
                this._wg0up();
            });
            menuitem2.connect('activate', () => {
                this._wg0downP();
            });
        }
    }



    _removeTimeout() {
        if (this._timeout) {
            Mainloop.source_remove(this._timeout);
            this._timeout = null;
        }
    }

    _onDestroy() {
        this._removeTimeout();
        super._onDestroy();
    }

    _wg0up() {
        let cmd = 'sudo wg-quick up wg0';
        // eslint-disable-next-line no-unused-vars
        var [ok, out, err, exit] = GLib.spawn_command_line_sync(cmd);
        this._refresh();
    }

    _wg0down() {
        let cmd = 'sudo wg-quick down wg0';
        // eslint-disable-next-line no-unused-vars
        var [ok, out, err, exit] = GLib.spawn_command_line_sync(cmd);
        this._refresh();
    }

    _refresh() {
        // log('vpnstatus-refresh')
        let cmd = '/bin/bash -c "ip a | grep -E \'tun0|ipsec0|wg0\'"';
        // eslint-disable-next-line no-unused-vars
        var [ok, out, err, exit] = GLib.spawn_command_line_sync(cmd);
        if (exit === 0) {
            this.topLabel.set_text('VPN ⬆');
            this.topLabel.style_class = 'connected';
        } else {
            this.topLabel.set_text('VPN ⬇');
            this.topLabel.style_class = 'disconnected';
        }
        return true;// force true else loop stop
    }

});

let _vpnButton;

// eslint-disable-next-line no-unused-vars
function init() {
}

// eslint-disable-next-line no-unused-vars
function enable() {
    _vpnButton = new VpnStatusMenuButton();
    Main.panel.addToStatusArea('vpnstatus', _vpnButton);
}

// eslint-disable-next-line no-unused-vars
function disable() {
    _vpnButton.destroy();
}
