### 5 Github Visualisations

1. CALENDAR MAP
Audience: The primary audience for this visualisation is the GitHub user themsleves, as well as interested parties including prospective employers and bosses. This visualisation answers the questions of when am I undertaking work and the quantity undertaken. It support the context & detil paradigm
Data used: The data used is ana array of length 2. The first item being the number of a certain type of interaction occuring on that day i.e. commits and the second being the time stamp which contains, day, month, year GET /users/:user. i.e. https://api.github.com/users/fraser-campbell/events.
	Alternatively this data could be collected by combining calls to all the relevent repos associated with a user:
		https://api.github.com/users/fraser-campbell/repos - returns a list of the public and private repos
		https://api.github.com/users/fraser-campbell/orgs - returns a list of the organisations the user is a member of
			https://api.github.com/users/fraser-campbell/orgs/:orgs/repos - returns a list of the repos associated with those organisations
	Once you have all the associated repos you could then search these for commits authored by the user we are interested in 
		https://api.github.com/repos/:owner/:repo/commits?author=fraser-campbell
	Once we have this information we would construct a Javascript object that contains the counts of all the committs for each day in the last year


2. CONTRIBUTERS
Audience: The primary audience for this is probably a project manager on the owner of a repositary. It provides an overview of the timeline of work on a givene repositary. It also shows the breakdown by contributer and allows comparison of these, (though not easily), and it does not facilitate side by side or quantitative comparison. The brushing functionality of the visualisation is also very useful to focus on a part of a project and consider the different contributions at a specific point in time
Data: The dataset is a time by week and contributer stamped dataset of different types of interactions with the repositary: commits, additions, deletions. The data can be accessed by querying the GitHub API as follows: `https://api.github.com/repos/mbostock/d3/stats/contributors`.

3. COMMIT ACTIVITY
Audience: The audience for this is similar to the above visualisation and is useful for large code project management purposes.
Data: The data required is the weekly commits to the repositary for each day in the last year `https://api.github.com/repos/mbostock/d3/stats/commit_activity'

3. COMMIT ACTIVITY
Audience: The audience for this is similar to the above toe visualisation and is useful for large code project management purposes or for curious visitors to track how the body of code has changed over time.
Data: The data required is the weekly additions and deletions to the repositary for each week in the last year `https://api.github.com/repos/mbostock/d3/stats/code_frequency'

4. PUNCHCARD
Audience: This visualisation is again useful for curious visitors but answers a number of questions for code project managers. Including, the times of the week when work is done on the project and therefore times when it is best to avoid disturbing coding or work habits. It also identifies optimal times for collaboration potentially.
Data: The data required is the count of commits per hour, for each day of the week: `https://api.github.com/repos/mbostock/d3/stats/punch_card`

5.	PULSE
Audience: The pulse visualisation is designed to show a point in time visualisation of the state of a repositary. It highlights the active issues and state of these, it also includes a record of contributers involved in recent commits and a record of the recent work. This is likely most ideful for people actually working on code bases daily as a task list and issues list; as well as the project managers overseeing this work.
Data: the visualisation uses the data for:
	open and closed pull requests: 'https://api.github.com/repos/mbostock/d3/pulls?state=open` - The data should be filtered by the created_at field and merged_at field.
	open and closed issues: 'https://api.github.com/repos/mbostock/d3/issues?state=open` - The data should be filtered by the created_at field
	bar graph commits authored: `https://api.github.com/repos/mbostock/d3/commits?since=YYYY-MM-DDTHH:MM:SSZ`. This data can be filtered by `author` and summed for each author. 


HIGH VOLUME OF ACTIVITY

We're asked to address the issue of many new commits being pushed in a short time interval (i.e., "bursted") for each of the repository statistics visualisations that GitHub provides.

- To deal with frequent commits in your data set oyou would take the advice of github and use cached data in requests, this avoids expensive recomputation each time you want ot update a visualisation.
- In terms of the actual visualisation I would deploy the option to switch to logarithmic scale so spikes in the activity do not obscure all previous data. I might also deploy the context and zoom paradigm in the other graphs similar to the 1st in order to see the overall context of commits while focussing on the particular time period we are interested in, perhaps using brushing.


NETWORK GRAPH
1. Interaction: Interaction here plays the role of receiving more detail about the visulisation and data set. You can filter the dataset for a particular period in time or a particular contributers timeline through dragging and translating the graph. You can also gain information about a particular commit by hovering over and recieving a tooltip. Clicking on this tooltip will thenbring you to the location of the commit on github.

2. A static vaiation would not have been sufficient, as you would not have the ability to explore information about each commit; this is required to make the graph useful. Presenting all this information on a static graph would not have been possible.

3. If many new developers were to contribute for the first time then you would have a problem with space as you would introduce multiple branches. The current solution is to introduce a new row for each of these branches at the bottom of the graph, however it is awkward to gain an overview as a result. A possible solution might be to change the scale or have some overview image as part of the visualisation. Furthermore you could reorder rows in the visulisation or even close of rows where there has been no activity for a certain length of time.


