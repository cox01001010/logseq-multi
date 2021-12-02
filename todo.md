- # ALL TASKS
	-
	  query-table:: false
	  #+BEGIN_QUERY
	  {:title "All Tasks"
	   :query [:find (pull ?b [*])
	               :where
	               [?b :block/marker ?m]
	               [(not= ?m "nil")]]}
	  #+END_QUERY
# Work Big
collapsed:: true
open ended tasks that will take a while, go in and break these down at some point
	- sales notes (from IRMMW THz 2019)
		- this includes contacting various people already identified
	- development notes
	- archive notes
	  
	  ![[PersonalWorkObjectives]]
# Personal Big
collapsed:: true
	- [ ] tile [[2021-01-22]]
	- [ ] maya litter pick