#!/bin/bash
PSQL="psql --username=freecodecamp --dbname=periodic_table --tuples-only --no-align -c"

if [ -z $1 ]
then
    echo Please provide an element as an argument.
    exit 0
    elif [[ $1 =~ [0-9]+ ]]; then
    ELEMENT=$($PSQL "SELECT * FROM elements FULL JOIN properties USING(atomic_number) FULL JOIN types USING(type_id) WHERE atomic_number=$1")
    elif [[ $1 =~ [a-zA-Z]{3,} ]]; then
    ELEMENT=$($PSQL "SELECT * FROM elements FULL JOIN properties USING(atomic_number) FULL JOIN types USING(type_id) WHERE name='$1'")
else
    ELEMENT=$($PSQL "SELECT * FROM elements FULL JOIN properties USING(atomic_number) FULL JOIN types USING(type_id) WHERE symbol='$1'")
fi

IFS="|" read -r TYPE_ID ATM_NUM SYM NAME MASS MELT BOIL TYPE<<< $ELEMENT

if [ -z $ATM_NUM ]; then
    echo I could not find that element in the database.
else
    echo "The element with atomic number $ATM_NUM is $NAME ($SYM). It's a $TYPE, with a mass of $MASS amu. $NAME has a melting point of $MELT celsius and a boiling point of $BOIL celsius."
fi