# Guards

## Roles

There are several roles in a gym:

-   _admin_ : full control (programmer)
-   _manager_ : full control **business flow** ( gym owner or partner )
-   _employee_ :
    -   _receptionist_
-   _user_
    -   _vip user_

## Hierarchy

```
- admin
    - manager
        - senior trainer
            - trainer
        - senior receptionist
            - receptionist
        - professionists (nail-artist, chiropratic, ...)
    - vip user
        - user
```

## Page access

### Admin

All

### Manager

-   new user
-   new trainer
-   new receptionist
-   new professionist
-   users
-   trainers

### Senior Trainer

-   trainer plan
-   new workout
-   new exercise
-   workouts
-   my workouts
-   my users

### Trainer

-   new workout
-   new exercise
-   my users
-   my workouts

### Senior receptionist

-   book
-   user
-   new user

### Receptionist

-   book
-   users
-   new user

### Professionist

-   book
-   pro area

### Vip User

-   vip area
-   personal area
-   book

### User

-   personal area
-   book
