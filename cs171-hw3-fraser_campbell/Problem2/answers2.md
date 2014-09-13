Q1: Look at the data given in the Wiki table. Describe the data types. What is different from the datasets you've used before?
Difference from before: - The data is sparse, eith a lot of missing data, the data represents estimates or outputs from competing models. It contains a number of datasets purporting to measure the same thing. The data is explicitly temporal
Data Type: - The data is Quantitative.

Q2: Formulate in jQuery selector syntax the selection that would give you:
The DOM element for the second row in the Wikipedia table
Answer: - var rows = root.find(".wikitable tbody tr:eq(2)")
		      
Write down in selection syntax how you would get all table rows that are not the header row
Answer: - var rows = root.find(".wikitable tbody tr:gt(0)")