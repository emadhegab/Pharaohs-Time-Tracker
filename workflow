1- user start activity 
	if activity valid 
		update activity to todays list of activities 
		update run badge updater
		run application notifier
    esle
        show error message 

2- user Stop activity 
    update table 
    update activity list 
    clear application notifier
    clear badge 

3- application start 
    get activity list for today
    if any activity running 
        update badge
        update application notifier
        set button to stop activity
4- user edit activity
    if update information valid
        update activity record
        if running
            update badge
            update application notifier
5-browser started
     get activity list for today
    if any activity running 
        update badge
        update application notifier
        set button to stop activity
