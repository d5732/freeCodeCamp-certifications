#!/bin/bash
PSQL="psql --username=freecodecamp --dbname=number_guess --tuples-only --no-align -c"
echo "Enter your username:"
#and take a username as input. Your database should allow usernames of at least 22 characters
read USERNAME

USER_QUERY_RESULT=$($PSQL "SELECT user_id, username, games_played, best_game FROM users WHERE username='$USERNAME';")
if [ -z $USER_QUERY_RESULT ]; then
  echo "Welcome, $USERNAME! It looks like this is your first time here."
  INSERT_USER_RESULT=$($PSQL "INSERT INTO users(username) VALUES('$USERNAME') RETURNING user_id;")
  read USER_ID <<< $INSERT_USER_RESULT
else 
  IFS="|" read -r USER_ID USERNAME GAMES_PLAYED BEST_GAME <<< $USER_QUERY_RESULT
  echo "Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
fi

TARGET=$(( $RANDOM % 1000 + 1 ))
echo "Guess the secret number between 1 and 1000:"
read GUESS
GUESS_COUNT=1
while [[ $GUESS != $TARGET ]]; do
  if [[ ! $GUESS =~ [0-9]+ ]]; then
    echo "That is not an integer, guess again:"
  elif [[ $GUESS > $TARGET ]]; then
    echo "It's lower than that, guess again:"
  else 
    echo "It's higher than that, guess again:"
  fi
  read GUESS
  GUESS_COUNT=$(($GUESS_COUNT + 1))
done

echo "You guessed it in $GUESS_COUNT tries. The secret number was $TARGET. Nice job!"

if [[ -z $BEST_GAME || $GUESS_COUNT -lt $BEST_GAME ]]; then
  UPDATE_RESULT=$($PSQL "UPDATE users SET games_played=$(($GAMES_PLAYED + 1)), best_game=$GUESS_COUNT WHERE user_id='$USER_ID'")
else 
  UPDATE_RESULT=$($PSQL "UPDATE users SET games_played=$(($GAMES_PLAYED + 1)) WHERE user_id='$USER_ID'")
fi
