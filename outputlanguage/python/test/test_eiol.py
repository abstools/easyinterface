import unittest
import xml.etree.ElementTree as ET
import eiol


class TestEIOL(unittest.TestCase):
    def test_root(self):
        root = eiol.create_output()
        rootstr = ET.tostring(root, encoding='utf8', method='xml')
        solution = "<?xml version='1.0' encoding='utf8'?>"\
                   "<eiout />"

        self.assertEqual(rootstr.replace('\n', ''),
                         solution.replace('\n', ''))

    def test_root_version(self):
        root = eiol.create_output(version='0.2')
        rootstr = ET.tostring(root, encoding='utf8', method='xml')
        solution = "<?xml version='1.0' encoding='utf8'?>"\
                   '<eiout version="0.2" />'

        self.assertEqual(rootstr.replace('\n', ''),
                         solution.replace('\n', ''))