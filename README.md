# gnome-shell-ext
Quick and simple gnome shell extensions.



## Extensions

### kubectx

Display in status area the current-context of kubectl config.

Refresh every 5.0 seconds.

Required : 
* `kubectl` 
* `~/.kube/config`  



### public-ip

Display current public ip in status area from [api.ipify.org](https://api.ipify.org/)



### vpn-status

Display current vpn status according to existing current interfaces.
Check `tun0` or `ipsec0` or `wg0` interface exist.

Refresh every 5.0 seconds.


If `wireguard` and `wg-quick` are installed, there is a sub menu that can `up` or `down` quickly a default `wg0` interface using `/etc/wiregaurd/wg0.conf`.





## Development

### Nodejs 

Install [nvm](https://github.com/nvm-sh/nvm) to manage node and npm.

Run `nvm use` to use the node version set in __.nvmrc__.


### Eslint

Install  eslint modules : 

```
npm i -D eslint eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard
```

