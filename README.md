Websocket and Kafka Broker Application

Websocket and Kafka Broker Application with simple functionality to produce messages from html-form to Kafka broker and then consume this message to paticular user via Websocket Server.

Features:

    Implementation HTML5 Websocket and Kafka Broker v.2 and Zookeeper.

Installation:

	1. Install Nodejs and Kafka

	npm install

	2. Create topic in Kafka:

	/usr/local/kafka/bin/kafka-topics.sh --create --topic news --zookeeper localhost:2181 --partitions 1 --replication-factor 1

	3. Start Websocket server:

	npm run start
	or:
	node server.js

	Open page in several browsers:

	http://192.168.33.10:8080/ or localhost:8080

	4. Run Kafka producer:

	/usr/local/kafka/bin/kafka-console-producer.sh --broker-list 127.0.0.1:9092 --topic news

	Write messages there in terminal and they printed out in browser page via client.js
	All messages are printed only in browser where they put into form, not in all browsers. So personal notifications could be sent only to particular user.


Software Installation:

	Add Node.js PPA. Before installing the latest version of Node.js, you must add its PPA to Ubuntu… This repository is provided by the official package mainterner… To add the repository, run the commands below…:

	sudo apt install curl

	Then for the Latest release, add this PPA..

	curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -

	Install Node.js and NPM. To install, run the commands below:

	sudo apt install nodejs

	After installing, both Node.js and NPM modules should be installed and ready to use…. You can use the commands below to view the version number installed…:

	node -v
	npm -v

	Install Kafka:

	1. Add 'kafka' user:

  	$ sudo useradd kafka -m

	2.   Install Java:

  	$ sudo apt-get update
  	$ sudo apt-get install default-jre

  
	3. Install zookeeper::

  	$ sudo apt-get install zookeeperd
  
  	.. note::
  
    After the installation completes, ZooKeeper will be started as a daemon automatically. By default, it will listen on port 2181.

    
	4. Confirm zookeeper is running on expected port::

  	$ telnet localhost 2181
  	Trying ::1...
  	Connected to localhost.
  	Escape character is '^]'.
  	ruok <-- Type at empty prompt!
  	imokConnection closed by foreign host.
  
  	.. note::
  
    if after typing 'ruok' once connected to 'localhost', zookeeper will respond with 'imok' and close the session.


	5. Download kafka from http://kafka.apache.org/downloads.html::

	Download 2.2.0 is the latest release. The current stable version is 2.2.0.

	Binary downloads:

    Scala 2.11  - kafka_2.11-2.2.0.tgz (asc, sha512)
    Scala 2.12  - kafka_2.12-2.2.0.tgz (asc, sha512)

 	We suggest the following mirror site for your download:

	http://apache-mirror.rbc.ru/pub/apache/kafka/2.2.0/kafka_2.11-2.2.0.tgz

	Create folder in home directory :

	cd ~
	mkdir Downloads
	cd Downloads

	download link:

	wget http://apache-mirror.rbc.ru/pub/apache/kafka/2.2.0/kafka_2.11-2.2.0.tgz

	Unzip the archive:

	tar -xvf kafka_2.11-2.2.0.tgz


	6. Move binaries to /usr/local/kafka::

  	$ sudo mv kafka_2.11-2.2.0 /usr/local/kafka

	Kafka persists data to disk so we will now make a directory for it.

	Create catalogue at: /usr/local/kafka/data
	sudo mkdir /usr/local/kafka/data

	7. Configure Kafka Server::
  
  	# turn on topic delete
  	$ sudo nano /usr/local/kafka/config/server.properites
  
  	#>> At end of file add:
  	delete.topic.enable = true

	next, we will change log directory

 	log.dirs=/usr/local/kafka/data

 	 save and quit

	8. Ensure Permission of Directories

	First, we will ensure kafka user which we created at 1st step has permission to all of the Kafka related directories.

	sudo chown -R kafka:nogroup /usr/local/kafka

	9. Create files Systemd Unit and startup Kafka server

	Systemd Unit helps to perform start, stop and restart Kafka together with other Linux services. Create file for Zookeeper:

	sudo nano /etc/systemd/system/zookeeper.service

	Put these lines into it:

	[Unit]
	Requires=network.target remote-fs.target
	After=network.target remote-fs.target
	[Service]
	Type=simple
	User=kafka
	Environment=JAVA_HOME=/usr/lib/jvm/java-8-oracle
	ExecStart=/usr/local/kafka/bin/zookeeper-server-start.sh /usr/local/kafka/config/zookeeper.properties
	ExecStop=/usr/local/kafka/bin/zookeeper-server-stop.sh
	Restart=on-abnormal
	[Install]
	WantedBy=multi-user.target

	10. Create file for service for Kafka:

	sudo nano /etc/systemd/system/kafka.service

	Type these lines there:

	[Unit]
	Description=Apache Kafka server (broker)
	Documentation=http://kafka.apache.org/documentation.html
	Requires=network.target remote-fs.target
	After=network.target remote-fs.target kafka-zookeeper.service	
	[Service]
	Type=simple
	User=kafka
	Environment=JAVA_HOME=/usr/lib/jvm/java-8-oracle
	ExecStart=/usr/local/kafka/bin/kafka-server-start.sh /usr/local/kafka/config/server.properties
	ExecStop=/usr/local/kafka/bin/kafka-server-stop.sh
	[Install]
	WantedBy=multi-user.target

	You can select to forward the log to another file so that your syslog is clean. The log file will slowly grow huge over time so you might want to trim it from time to time. Change ExecStart line as follows:

	ExecStart=/usr/local/kafka/bin/kafka-server-start.sh /usr/local/kafka/config/server.properties > /usr/local/kafka/server.log

	11. Enable kafka user to Kafka directory:

	sudo chown -R kafka:nogroup /usr/local/kafka

	11. Now start Kafka service:

	sudo systemctl daemon-reload
	sudo systemctl start zookeeper.service
	sudo systemctl start kafka.service

	or like this:
	sudo systemctl start kafka
	sudo systemctl stop kafka
	sudo systemctl restart kafka 

	To enshure that kafka works check journal for Kafka section kafka:

	sudo journalctl -u kafka

	11. To autostart Kafka type:

	sudo systemctl enable zookeeper
	sudo systemctl enable kafka

	Check status of the service by

	sudo systemctl status kafka
	sudo systemctl status zookeeper