#importing each and every important modules from google adk.
from google.adk.agents import SequentialAgent
from ..AgentToAgent import report_analyze_agent, weakness_detector_agent, quiz_generator_agent, frontend_quiz_agent


"""
                    TeacherAgent - Analyze marksheet, taking action on Weak Subjects and planning quizes for you on behalf of your weak subject
"""

root_agent = SequentialAgent(
    name='TeacherAgent',
    sub_agents=[report_analyze_agent, weakness_detector_agent, quiz_generator_agent, frontend_quiz_agent],
)