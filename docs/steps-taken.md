# Steps Taken
This document describes the steps taken in manually setting up server(s). The idea is that this will eventually be automated with a IaC tool.

## Minecraft Server
- Add automount for the high performance SSD
- Install Docker
- Create firewall rule allowing tcp:25565 (in gcp console)
- ```docker run -d -v /home/minecraft:/data -p 25565:25565 -e EULA=TRUE --name mc itzg/minecraft-server```
- Install and run monitoring agent 
    - Add apt repo 
    ```
    curl -sSO https://dl.google.com/cloudagents/add-monitoring-agent-repo.sh
    sudo bash add-monitoring-agent-repo.sh
    sudo apt-get update
    ```
    - Install latest
    ```
    sudo apt-get install stackdriver-agent
    ```
    - Start the service
    ```
    sudo service stackdriver-agent start
    ```
