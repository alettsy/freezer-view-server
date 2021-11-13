# Freezer View Server

## Set up

`npm install`

## Running

`node index.js`

## Create a system service

1. `cd /etc/systemd/system`
2. Create file `freezer-server.service`
    ```
    [Unit]
    Description=Freezer Server

    [Service]
    ExecStart=/usr/local/bin/node /path/to/index.js
    ```
3. Now you can start and stop it using the `systemctl` command
    - `sudo systemctl start freezer-server.service`
    - `sudo systemctl stop freezer-server.service`
4. If you run into problems, check the journal
    - `journalctl -e`