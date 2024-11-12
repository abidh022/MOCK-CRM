// //controllers.leadController.js

// // Get all leads
// exports.getLeads = async (req, res) => {
//     try {
//         const leads = await Lead.find(); 
//         res.json(leads); 
//     } catch (error) {
//         console.error('Error fetching leads:', error); 
//         res.status(500).json({ message: error.message }); 
//     }
// };

// // Create a new lead
// exports.createLead = async (req, res) => {
//     const lead = new Lead(req.body); 
//     try {
//         const savedLead = await lead.save(); // Save the lead to the database
//         res.status(201).json(savedLead); // Respond with the created lead
//     } catch (error) {
//         res.status(400).json({ message: error.message }); 
//     }
// };

// // Update a lead by ID
// exports.updateLead = async (req, res) => {
//     try {
//         const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
//         if (!updatedLead) {
//             return res.status(404).json({ message: 'Lead not found' });
//         }
//         res.json(updatedLead); 
//     } catch (error) {
//         res.status(400).json({ message: error.message }); 
//     }
// };

// // Delete a lead by ID
// exports.deleteLead = async (req, res) => {
//     try {
//         const deletedLead = await Lead.findByIdAndDelete(req.params.id); 
//         if (!deletedLead) {
//             return res.status(404).json({ message: 'Lead not found' });
//         }
//         res.status(204).send(); 
//     } catch (error) {
//         res.status(400).json({ message: error.message }); 
//     }
// };
