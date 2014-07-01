//////////////////////////////////////////////
///////// Calendar Events for Sidebar ////////
//////////////////////////////////////////////
$("#sidebarCalendar").eventCalendar({
	  eventsjson: 'http://127.0.0.1:8020/git/Sales%2520Application/SalesApplication/SalesApplication.UI/Resources/data/events.json',
	  eventsScrollable: true,
	  showDescription: true,
	  startWeekOnMonday: false
});