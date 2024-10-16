document.addEventListener('DOMContentLoaded', () => {
  fetch('https://port-0-mbti-unity-contest-m2b4c11v2fad4f29.sel4.cloudtype.app/player')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error');
      }
      return response.json();
    })
    .then(data => {
      populateTeamTable(data.teamP, 'teamP');
      populateTeamTable(data.teamJ, 'teamJ');
    })
    .catch(error => console.error('Error fetching data:', error));

  function populateTeamTable(team, tableId) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    team.forEach(player => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${player.nickname}</td>
        <td>${player.afreecatvId}</td>
        <td>${player.minecraftId}</td>
        <td>${player.upCount}</td>
      `;
      tbody.appendChild(row);
    });
  }

  document.getElementById('refreshButton').addEventListener('click', async () => {
    const requestBody = {
      bjname: 'moolchoco',
      titleNo: 138908007,
    };

    try {
      const submissionResponse = await fetch(
        'https://port-0-mbti-unity-contest-m2b4c11v2fad4f29.sel4.cloudtype.app/submission',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!submissionResponse.ok) {
        throw new Error('Failed submissionResponse');
      }

      const playerResponse = await fetch(
        'https://port-0-mbti-unity-contest-m2b4c11v2fad4f29.sel4.cloudtype.app/player',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!playerResponse.ok) {
        throw new Error('Failed playerResponse');
      }

      const playerDataText = await playerResponse.text();

      if (playerDataText) {
        const playerData = JSON.parse(playerDataText);
        populateTeamTable(playerData.teamP, 'teamP');
        populateTeamTable(playerData.teamJ, 'teamJ');
      } else {
        console.warn('Player data is empty');
      }

      alert('갱신이 완료되었습니다!');
    } catch (error) {
      console.error('Error:', error);
      alert('갱신 중 오류가 발생했습니다.');
    }
  });
});
