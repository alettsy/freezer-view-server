> ⚠️ This project has been replaced by a much better quality application which you can find here: [alettsy/food-manager](https://github.com/alettsy/food-manager)

# Freezer View Server

## Getting started

- Run `npm install` to install necessary packages
- Run `node index.js` to run the application

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
