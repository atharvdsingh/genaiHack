#importing each and every important modules from google adk.

from google.adk.agents import Agent, SequentialAgent
from google.adk.models.google_llm import Gemini
from google.adk.tools import AgentTool, google_search

"""
                    TeacherAgent - Analyze marksheet, taking action on Weak Subjects and planning quizes for you on behalf of your weak subject
"""






report_analyze_agent=Agent(
    name = 'ReportAnalyzeAgent',
    model='gemini-2.5-flash',
    instruction="""You are a specilized report analyze agent. Your only job to use the google_search tool to determine weak_subject and strong_subject given by student""",
    tools = [google_search],
    output_key="report_analyze_finding",
)

weakness_detector_agent = Agent(
    name='WeaknessDetector',
    model='gemini-2.5-flash',
    instruction="""Extract the one weak_subject from the report_analyze_finding: {report_analyze_finding}
Create a concise tabular summary as a bulleted list with 3-5 key points.""",
    output_key='weakness_finding_subject'

)

quiz_generator_agent=Agent(
    name='QuizGeneratorAgent',
    model='gemini-2.5-flash',
    instruction="""give five quizes question on the provided weakness_finding_subject: {weakness_finding_subject}
Create quiz in a concise tabular format""",
    output_key='quiz_generate',

)








root_agent = SequentialAgent(
    name='TeacherAgent',
    sub_agents=[report_analyze_agent, weakness_detector_agent, quiz_generator_agent],
)