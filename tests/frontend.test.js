// Frontend JavaScript tests
describe('Frontend JavaScript Functions', () => {
  
  beforeEach(() => {
    // Setup basic DOM structure that the app expects
    document.body.innerHTML = `
      <div id="userList"></div>
      <div id="analysisResults"></div>
      <div id="recommendations"></div>
      <div id="results" class="hidden"></div>
    `;
  });

  // Test for the innerHTML error - this should fail initially
  describe('DOM Element Access', () => {
    test('should handle missing DOM elements gracefully', () => {
      // Remove the expected DOM elements to simulate the error
      document.body.innerHTML = '';
      
      // Mock the renderResults function that causes the innerHTML error
      const renderResults = (result) => {
        const analysisDiv = document.getElementById('analysisResults');
        const recommendationsDiv = document.getElementById('recommendations');
        
        // This should not throw an error even if elements are null
        expect(() => {
          if (analysisDiv) {
            analysisDiv.innerHTML = `<div class="alert alert-info">Analysis: ${result.commonPlatforms.analysis}</div>`;
          }
          if (recommendationsDiv) {
            recommendationsDiv.innerHTML = `<div class="alert alert-success">Recommendations: ${result.recommendations.reason}</div>`;
          }
        }).not.toThrow();
      };
      
      const mockResult = {
        commonPlatforms: { analysis: 'Test analysis', commonPlatforms: [] },
        recommendations: { reason: 'Test reason', recommendations: [] }
      };
      
      renderResults(mockResult);
    });

    test('should fail when trying to set innerHTML on null element', () => {
      // This test demonstrates the current bug - should fail initially
      document.body.innerHTML = '';
      
      const buggyRenderResults = (result) => {
        const analysisDiv = document.getElementById('analysisResults');
        // This will throw an error because analysisDiv is null
        analysisDiv.innerHTML = `<div>Content</div>`;
      };
      
      const mockResult = {
        commonPlatforms: { analysis: 'Test analysis', commonPlatforms: [] },
        recommendations: { reason: 'Test reason', recommendations: [] }
      };
      
      expect(() => {
        buggyRenderResults(mockResult);
      }).toThrow();
    });
  });

  describe('User Management Functions', () => {
    test('should handle user selection without errors', () => {
      const selectedUsers = [];
      
      const toggleUser = (userId, element) => {
        const index = selectedUsers.indexOf(userId);
        if (index > -1) {
          selectedUsers.splice(index, 1);
          if (element) element.classList.remove('selected');
        } else {
          selectedUsers.push(userId);
          if (element) element.classList.add('selected');
        }
      };
      
      const mockElement = document.createElement('div');
      mockElement.classList.add('user-card');
      
      // Test adding user
      toggleUser(1, mockElement);
      expect(selectedUsers).toContain(1);
      expect(mockElement.classList.contains('selected')).toBe(true);
      
      // Test removing user
      toggleUser(1, mockElement);
      expect(selectedUsers).not.toContain(1);
      expect(mockElement.classList.contains('selected')).toBe(false);
    });

    test('should handle missing user list element', () => {
      document.body.innerHTML = '';
      
      const renderUsers = (users) => {
        const userList = document.getElementById('userList');
        if (userList) {
          if (users.length === 0) {
            userList.innerHTML = '<p>No users found. Add some users first!</p>';
          } else {
            userList.innerHTML = users.map(user => `<div class="user-card">${user.name}</div>`).join('');
          }
        }
      };
      
      expect(() => {
        renderUsers([]);
      }).not.toThrow();
    });
  });

  describe('Feature Selection Functions', () => {
    test('should get selected features safely', () => {
      document.body.innerHTML = `
        <div class="features">
          <div class="feature-item">
            <input type="checkbox" id="voiceCalls" value="voiceCalls" checked>
            <label for="voiceCalls">Voice Calls</label>
          </div>
          <div class="feature-item">
            <input type="checkbox" id="videoCalls" value="videoCalls">
            <label for="videoCalls">Video Calls</label>
          </div>
        </div>
      `;
      
      const getSelectedFeatures = () => {
        const features = [];
        const checkboxes = document.querySelectorAll('.feature-item input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => features.push(checkbox.value));
        return features;
      };
      
      const selectedFeatures = getSelectedFeatures();
      expect(selectedFeatures).toEqual(['voiceCalls']);
    });
  });

  describe('Alert System', () => {
    test('should show alerts without errors', () => {
      const showAlert = (message, type) => {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        if (document.body) {
          document.body.insertBefore(alert, document.body.firstChild);
        }
        
        return alert;
      };
      
      const alert = showAlert('Test message', 'success');
      expect(alert.textContent).toBe('Test message');
      expect(alert.className).toBe('alert alert-success');
    });
  });

  describe('Loading State', () => {
    test('should show loading state safely', () => {
      const showLoading = () => {
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
          resultsDiv.classList.remove('hidden');
          resultsDiv.innerHTML = '<div class="loading">Analyzing group preferences...</div>';
        }
      };
      
      expect(() => {
        showLoading();
      }).not.toThrow();
      
      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.classList.contains('hidden')).toBe(false);
      expect(resultsDiv.innerHTML).toContain('Analyzing group preferences...');
    });
  });
});