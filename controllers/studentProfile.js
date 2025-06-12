const db = require('../models');
const Profile = db.Profile;

// GET /api/profile/me
exports.getProfile = async (req, res) => {
  try {
    const email = req.student?.email;
    if (!email) return res.status(401).json({ msg: 'Unauthorized' });

    const profile = await Profile.findOne({ where: { email } });

    if (!profile) return res.status(404).json({ msg: 'Profile not found' });

    // Ensure skills are parsed from JSON string to array before sending
    const profileData = profile.toJSON(); // Get a plain object
    if (profileData.skills && typeof profileData.skills === 'string') {
      try {
        profileData.skills = JSON.parse(profileData.skills);
      } catch (e) { 
        console.error("Error parsing skills JSON:", e); 
        profileData.skills = []; // Default to empty array on parse error
      }
    }
    return res.status(200).json(profileData);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/profile
exports.createOrUpdateProfile = async (req, res) => {
  const email = req.student?.email;
  if (!email) return res.status(401).json({ msg: 'Unauthorized' });

  const {
    fullName = '',
    age = null,
    bio = '',
    avatar = '',
    skills = [],
    education = '',
    experience = '',
    github = '',
    linkedin = ''
  } = req.body;

  try {
    // Frontend now sends an array, but this handles string just in case or for other clients
    const cleanedSkills = Array.isArray(skills)
      ? skills
      : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

    const [profile, created] = await Profile.upsert(
      {
        email,
        fullName,
        age,
        bio,
        avatar,
        skills: JSON.stringify(cleanedSkills), // Store skills as JSON string
        education,
        experience,
        github,
        linkedin
      },
      { returning: true } // Ensure upsert returns the instance
    );
    
    // Sequelize upsert might not return the full profile in all dialects/versions as expected with 'returning: true'
    // For consistency, especially if 'profile' from upsert is just a boolean or affected row count,
    // fetch the profile again to ensure the full, updated data is returned.
    // However, if `profile` is correctly returned as the instance, this re-fetch is redundant.
    // Test this with your Sequelize version and dialect.
    // For now, assuming `profile` from upsert is the actual instance.
    // If not, you would do: const updatedProfile = await Profile.findOne({ where: { email } });

    return res.status(created ? 201 : 200).json({
      msg: created ? 'Profile created successfully' : 'Profile updated successfully',
      profile: profile, // Send the (potentially re-fetched) profile data
    });
  } catch (err) {
    console.error('Error saving profile:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/profile
exports.deleteProfile = async (req, res) => {
  const email = req.student?.email;
  if (!email) return res.status(401).json({ msg: 'Unauthorized' });

  try {
    const deleted = await Profile.destroy({ where: { email } });

    if (deleted === 0) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    return res.status(200).json({ msg: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting profile:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};
