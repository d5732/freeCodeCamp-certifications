#!/bin/bash
PSQL="psql --username=freecodecamp --dbname=salon --tuples-only --no-align -c"
echo -e "\n~~~~~ MY SALON ~~~~~\n"

MAIN_MENU(){
    # 2nd run alternate message as argument
    if [[ $1 ]]
    then
        echo -e "\n$1"
    else
        echo -e "Welcome to My Salon, how can I help you?\n"
    fi
    
    # service
    echo "$($PSQL "SELECT * FROM services")" | while IFS="|" read SERVICE_ID SERVICE_NAME
    do
        echo -e "$SERVICE_ID) $SERVICE_NAME"
    done
    read SERVICE_ID_SELECTED
    SERVICE_NAME=$($PSQL "SELECT name FROM services WHERE service_id=$SERVICE_ID_SELECTED")
    
    # if service not found
    if [[ -z $SERVICE_NAME ]]
    then
        MAIN_MENU "I could not find that service. What would you like today?"
    else
        
        # customer
        echo -e "\nWhat's your phone number?"
        read CUSTOMER_PHONE
        CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")
        
        # if customer not found
        if [[ -z $CUSTOMER_ID ]]
        then
            echo -e "\nI don't have a record for that phone number, what's your name?"
            read CUSTOMER_NAME
            INSERT_CUSTOMER_RESULT=$($PSQL "INSERT INTO customers(phone,name) VALUES('$CUSTOMER_PHONE', '$CUSTOMER_NAME')")
            CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")
            
        else
            CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE customer_id=$CUSTOMER_ID")
        fi
        
        # time
        echo -e "\nWhat time would you like your $SERVICE_NAME, $CUSTOMER_NAME?"
        read SERVICE_TIME
        INSERT_APPOINTMENT_RESULT=$($PSQL "INSERT INTO appointments(customer_id, service_id, time) VALUES($CUSTOMER_ID, $SERVICE_ID_SELECTED, '$SERVICE_TIME')")
        echo -e "\nI have put you down for a $SERVICE_NAME at $SERVICE_TIME, $CUSTOMER_NAME.\n"
    fi
}


MAIN_MENU
