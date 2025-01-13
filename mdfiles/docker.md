1) create a docker container for the postgres database.
    a) the container will be built on the local machine and then copied to the ec2 instance.
    b) do not use the -e option to run the docker container.
    c) copy the existing data to the container postgres database
    d) the data in the container database should persist when the container is stopped and started.
    e) the container will be run on an ec2 instance
    f) use the .env.local file to set the environment variables for the container.
2) create a docker container for the application.
    a) the container will be built on the local machine and then copied to the ec2 instance.
    b) the application will run on the same ec2 instance as the database container.
    c) the application will need to connect to the postgres database container.
    d) use the .env.local file to set the environment variables for the container.
    e) clerk will run in dev mode.
3) the containers will be deployed to the same existing ec2 instance.
    a) write a script to copy the containers to the ec2 instance using the command line and scp.
    b) start the the containers on the ec2 instance.
