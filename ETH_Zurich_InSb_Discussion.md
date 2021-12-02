# Preamble
	- Customer email to TK
	  collapsed:: true
	         
	  It was very nice to chat with you in person at the DNP meeting.  I would like to follow up on getting more information and also a quotation for a (WET, not cryo-free) Bolometer (/Semiconductor) that we discussed. I would want to also have the Mixer installed for phase sensitive detection (rather than only magnitude). 
	  
	  I understand the detection bandwidth is only 1 MHz, but I think this detector could still be very valuable to us, as it will not be blown so easily by the ~100 W gyrotrons. Please let me know how you suggest we can proceed with this. 
	  
	  Best Regards,
	  
	  Xander
	  
	  ***************************  
	  Alexander B. Barnes**
	  
	  Full Professor of Solid State NMR Spectroscopy
	  
	  ETH Zürich
	- Alisa 
	  collapsed:: true
	           
	  
	  Hi Ken,
	  
	  It would be with the customer: Xander (Alexander) Barnes, who is with ETH Zurich, and myself and you, etc..
	  
	  For a bit more background: Xander's focus is dynamic nuclear polarization at high fields (~200 GHz and 700-800 GHz). He makes his own frequency sweepable gyrotrons for DNP. Currently TK is building him an attenuation stage and MPI, where he was originally intending to use a zero biased detector to monitor the power; however, concerns about destroying the ZBD with the high gyrotron powers lead me and Richard to suggest a bolometer InSb system to him.
	- rjw
	  collapsed:: true
	        
	  Ken
	  
	  Ah, it is coming back to me
	  
	  The 700 GHz is just where they might want to end up...so will be lower I am sure (they are making gyrotrons)  
	  
	  I'm trying to remind myself of the Heterodyne NEP as (NEP_power)^2/ (LO power)......
	  
	  with LO power of 1uW
	  
	  I'm assuming      (10^-12)^2/((10^-6)*2)   or you   10^-18 Watts per root Hz
	  
	  [Alisa - worth noting the change in units]
	  
	  I need to look up Derek's notes on this
	  
	  Richard
- notes from pre-meeting [[2021-09-13]]
  
  customer has 100W of power from gyrottron and doesn't want to blow up zero bias detector.
  wants 
  1. power monitor
  2. ability to make phase sensitive measurements (ie use mixer)
  
  has to be wet 
  
  initally wants 200 (7cm-1) GHz but may want 700-800 (26cm-1) GHz
	- attenuation
	  collapsed:: true
	  
	  up to 3 stages of 30 to 40 dB of attenuation
	- coverage
	  collapsed:: true
	  
	  initially
	- my actions
	  collapsed:: true
		- i need to find examples of mixers 
		  collapsed:: true
		  costs of cryostats vs holdtime
		  
		  | cryostat | cost | n2 hold time (hours) | he hold time (days) |
		  | -------- | ---- | -------------------- | ------------------- |
		  | 1813     |      | 18 - 28              | 6                   |
		  | 1840     |      | 36 - 48              | 20                  |
		  | 1865     |      | 60 - 80              | 30                  |
		  | 1875     |      | > 90                 | 45                  | 
		  
		  
		  | Code    | Cryostat      | cost   |
		  | ------- | ------------- | ------ |
		  | QFI/2   | TK1813        | 33,150 |
		  | QFI/2B  | or 2BI TK1813 | 34,950 |
		  | QFI/2LF | TK1813        | 39,250 |
		  | QFI/3   | TK1840        | 39,150 |
		  | QFI/3B  | or 3BI TK1840 | 40,950 |
		  | QFI/3LF | TK1840        | 46,350 |
		  | QFI/4   | TK1865        | 43,800 |
		  | QFI/4B  | or 4BI TK1865 | 45,500 |
		  
		  [[Cryogenic Log]]
			-
- Meeting with Richard/Ken [[2021-09-17]]
	- from previous meetings we have determined that we want to bias the customer towards single lower frequency channel in an 1840. 
	  This
	- contradiction in expression of optical NEP
	- richard wants to be able to express order of magnitude of
	- transfer line?
- [[staff_levels]] recruitment