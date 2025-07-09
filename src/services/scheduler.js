class Scheduler {
  constructor(database) {
    this.db = database;
  }

  async scheduleGroupChat(groupId, platform, datetime, duration = 60, notes = '') {
    return new Promise((resolve, reject) => {
      const stmt = this.db.db.prepare(`
        INSERT INTO group_schedules (group_id, platform, scheduled_datetime, duration_minutes, notes, status)
        VALUES (?, ?, ?, ?, ?, 'scheduled')
      `);
      
      stmt.run(groupId, platform, datetime, duration, notes, function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      stmt.finalize();
    });
  }

  async getGroupSchedules(groupId) {
    return new Promise((resolve, reject) => {
      this.db.db.all(`
        SELECT gs.*, g.name as group_name
        FROM group_schedules gs
        JOIN groups g ON gs.group_id = g.id
        WHERE gs.group_id = ?
        ORDER BY gs.scheduled_datetime ASC
      `, [groupId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async updateScheduleStatus(scheduleId, status) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.db.prepare(`
        UPDATE group_schedules 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      stmt.run(status, scheduleId, function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
      stmt.finalize();
    });
  }

  async findOptimalTimes(groupId, platform, timeOptions = []) {
    // Simple implementation - could be enhanced with timezone handling
    const members = await this.db.getGroupMembers(groupId);
    const schedules = await this.getGroupSchedules(groupId);
    
    const suggestions = timeOptions.map(time => ({
      datetime: time,
      platform: platform,
      conflictScore: 0, // Could calculate based on existing schedules
      memberCount: members.length
    }));
    
    return suggestions.sort((a, b) => a.conflictScore - b.conflictScore);
  }

  generateMeetingLink(platform, groupName) {
    const links = {
      discord: `https://discord.gg/invite-for-${groupName.replace(/\s+/g, '-')}`,
      zoom: `https://zoom.us/j/meeting-for-${groupName.replace(/\s+/g, '-')}`,
      teams: `https://teams.microsoft.com/l/meetup-join/meeting-for-${groupName.replace(/\s+/g, '-')}`,
      skype: `https://join.skype.com/invite/meeting-for-${groupName.replace(/\s+/g, '-')}`,
      whatsapp: `https://chat.whatsapp.com/invite-for-${groupName.replace(/\s+/g, '-')}`,
      telegram: `https://t.me/joinchat/invite-for-${groupName.replace(/\s+/g, '-')}`
    };
    
    return links[platform] || `Meeting scheduled for ${groupName} on ${platform}`;
  }
}

module.exports = Scheduler;